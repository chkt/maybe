import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, any, may, resolve } from '../../source/convert/async.js';
import { createFailure, createResult } from '../../source/maybe.js';
import { messageSeverity } from '../../source/message.js';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('may', () => {
	it('should convert a rejected promise to a resolved failure', async () => {
		assert.deepStrictEqual(
			await may(
				async () => Promise.resolve(createResult('foo')),
				undefined
			),
			createResult('foo')
		);
		assert.deepStrictEqual(
			await may(
				async value => Promise.resolve(createResult(`${ value }bar`)),
				'foo'
			),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			await may(
				async () => Promise.resolve(createFailure('foo', messageSeverity.warn)),
				undefined
			),
			createFailure('foo', messageSeverity.warn)
		);
		assert.deepStrictEqual(
			await may(
				async value => Promise.resolve(createFailure(`${ value }bar`, messageSeverity.warn)),
				'foo'
			),
			createFailure('foobar', messageSeverity.warn)
		);
		assert.deepStrictEqual(
			await may(
				async () => { throw new Error('foo') },
				undefined
			),
			createFailure(new Error('foo'))
		);
		assert.deepStrictEqual(
			await may(
				async value => { throw new Error(`${ value }bar`) },
				'foo'
			),
			createFailure(new Error('foobar'))
		);
		assert.deepStrictEqual(
			await may(
				async () => Promise.reject(new Error('foo')),
				undefined
			),
			createFailure(new Error('foo'))
		);
		assert.deepStrictEqual(
			await may(
				async value => Promise.reject(new Error(`${ value }bar`)),
				'foo'
			),
			createFailure(new Error('foobar'))
		);
	});
});

describe('resolve', () => {
	it('should resolve a Maybe wrapping a Promise', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');

		assert.deepStrictEqual(
			await resolve(() => createResult(Promise.resolve('foo'), [ f0, f1 ]), undefined),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await resolve(() => createResult(Promise.reject(new Error('foo')), [ f0, f1 ]), undefined),
			createFailure(new Error('foo'), messageSeverity.error, [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await resolve(() => createFailure('foo', messageSeverity.warn, [ f0, f1 ]), undefined),
			createFailure('foo', messageSeverity.warn, [ f0, f1 ])
		);
	});
});

describe('all', () => {
	it('should process an array of promises', async () => {
		const f = [
			createFailure('f0', messageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(await all([
			Promise.resolve(createResult(0, [ f[0] ])),
			Promise.resolve(createResult(1, [ f[1] ])),
			Promise.resolve(createResult(2, [ f[2] ])),
			Promise.resolve(createResult(3, [ f[3] ])),
		]), {
			value : [ 0, 1, 2, 3 ],
			messages : f
		});
		assert.deepStrictEqual(await all([
			Promise.resolve(createFailure(0, messageSeverity.warn, [ f[0] ])),
			Promise.resolve(createResult(1, [ f[1] ])),
			Promise.resolve(createFailure(2, messageSeverity.warn, [ f[2] ])),
			Promise.resolve(createResult(3, [ f[3] ])),
		]), {
			code : 0,
			severity : messageSeverity.warn,
			messages : [
				{
					code : 0,
					severity : messageSeverity.warn,
					messages : [ f[0] ]
				},
				f[1],
				{
					code : 2,
					severity : messageSeverity.warn,
					messages : [ f[2] ]
				},
				f[3]
			]
		});
	});

	it('should handle promise rejections', async () => {
		const err0 = new Error('foo');
		const err1 = new Error('bar');
		const err2 = new Error('baz');
		const err3 = new Error('qux');

		assert.deepStrictEqual(await all([
			Promise.resolve(createResult(0)),
			Promise.resolve(createResult(1)),
			Promise.resolve(createResult(2)),
			Promise.reject(err3)
		]), {
			error : err3,
			severity : messageSeverity.error,
			messages : [{
				error : err3,
				severity : messageSeverity.error,
				messages : []
			}]
		});
		assert.deepStrictEqual(await all([
			Promise.reject(err0),
			Promise.reject(err1),
			Promise.reject(err2),
			Promise.reject(err3)
		]), {
			error : err0,
			severity : messageSeverity.error,
			messages : [{
				error : err0,
				severity : messageSeverity.error,
				messages : []
			}, {
				error : err1,
				severity : messageSeverity.error,
				messages : []
			}, {
				error : err2,
				severity : messageSeverity.error,
				messages : []
			}, {
				error : err3,
				severity : messageSeverity.error,
				messages : []
			}]
		});
	});
});

describe('any', () => {
	it('should process an array of promises', async () => {
		const f = [
			createFailure('f0', messageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(await any([
			Promise.resolve(createResult(0, [ f[0] ])),
			Promise.resolve(createResult(1, [ f[1] ])),
			Promise.resolve(createResult(2, [ f[2] ])),
			Promise.resolve(createResult(3, [ f[3] ]))
		]), {
			value : 0,
			messages : [ f[0] ]
		});
		assert.deepStrictEqual(await any([
			Promise.resolve(createFailure(0, messageSeverity.warn, [ f[0] ])),
			Promise.resolve(createFailure(1, messageSeverity.warn, [ f[1] ])),
			Promise.resolve(createFailure(2, messageSeverity.warn, [ f[2] ])),
			Promise.resolve(createResult(3, [ f[3] ]))
		]), {
			value : 3,
			messages : [ f[3] ]
		});
		assert.deepStrictEqual(await any([
			Promise.resolve(createFailure(0, messageSeverity.warn, [ f[0] ])),
			Promise.resolve(createFailure(1, messageSeverity.warn, [ f[1] ])),
			Promise.resolve(createFailure(2, messageSeverity.warn, [ f[2] ])),
			Promise.resolve(createFailure(3, messageSeverity.warn, [ f[3] ]))
		]), {
			text : 'no result',
			severity : messageSeverity.error,
			messages : [{
				code : 0,
				severity : messageSeverity.warn,
				messages : [ f[0] ]
			}, {
				code : 1,
				severity : messageSeverity.warn,
				messages : [ f[1] ]
			}, {
				code : 2,
				severity : messageSeverity.warn,
				messages : [ f[2] ]
			}, {
				code : 3,
				severity : messageSeverity.warn,
				messages : [ f[3] ]
			}]
		});
	});

	it('should handle promise rejections', async () => {
		const err0 = new Error('foo');
		const err1 = new Error('bar');
		const err2 = new Error('baz');
		const err3 = new Error('qux');

		assert.deepStrictEqual(await any([
			Promise.reject(err0),
			Promise.resolve(createResult(1)),
			Promise.resolve(createResult(2)),
			Promise.resolve(createResult(3))
		]), {
			value : 1,
			messages : []
		});
		assert.deepStrictEqual(await any([
			Promise.reject(err0),
			Promise.reject(err1),
			Promise.reject(err2),
			Promise.reject(err3),
		]), {
			text : 'no result',
			severity : messageSeverity.error,
			messages : [
				createFailure(err0),
				createFailure(err1),
				createFailure(err2),
				createFailure(err3),
			]
		});
	});
});
