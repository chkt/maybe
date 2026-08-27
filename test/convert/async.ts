import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, any, may, resolve } from '../../source/convert/async.js';
import { createFailure, createResult } from '../../source/maybe.js';
import { MessageSeverity } from '../../source/message.js';


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
				async () => Promise.resolve(createFailure('foo', MessageSeverity.warn)),
				undefined
			),
			createFailure('foo', MessageSeverity.warn)
		);
		assert.deepStrictEqual(
			await may(
				async value => Promise.resolve(createFailure(`${ value }bar`, MessageSeverity.warn)),
				'foo'
			),
			createFailure('foobar', MessageSeverity.warn)
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
			createFailure(new Error('foo'), MessageSeverity.error, [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await resolve(() => createFailure('foo', MessageSeverity.warn, [ f0, f1 ]), undefined),
			createFailure('foo', MessageSeverity.warn, [ f0, f1 ])
		);
	});
});

describe('all', () => {
	it('should process an array of promises', async () => {
		const f = [
			createFailure('f0', MessageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(
			await all([
				Promise.resolve(createResult(0, [ f[0] ])),
				Promise.resolve(createResult(1, [ f[1] ])),
				Promise.resolve(createResult(2, [ f[2] ])),
				Promise.resolve(createResult(3, [ f[3] ])),
			]),
			createResult([ 0, 1, 2, 3 ], f)
		);
		assert.deepStrictEqual(
			await all([
				Promise.resolve(f[0]),
				Promise.resolve(createResult(1, [ f[1] ])),
				Promise.resolve(f[2]),
				Promise.resolve(createResult(3, [ f[3] ])),
			]),
			createFailure({
				id : 'some failures',
				failures : [ f[0], f[2] ]
			}, MessageSeverity.error, f)
		);
	});

	it('should handle promise rejections', async () => {
		const err0 = new Error('foo');
		const err1 = new Error('bar');
		const err2 = new Error('baz');
		const err3 = new Error('qux');

		assert.deepStrictEqual(
			await all([
				Promise.resolve(createResult(0)),
				Promise.resolve(createResult(1)),
				Promise.resolve(createResult(2)),
				Promise.reject(err3)
			]),
			createFailure({
				id : 'some failures',
				failures : [ createFailure(err3) ],
			}, MessageSeverity.error, [ createFailure(err3) ])
		);
		assert.deepStrictEqual(
			await all([
				Promise.reject(err0),
				Promise.reject(err1),
				Promise.reject(err2),
				Promise.reject(err3)
			]),
			createFailure({
				id : 'some failures',
				failures : [
					createFailure(err0),
					createFailure(err1),
					createFailure(err2),
					createFailure(err3)
				]
			}, MessageSeverity.error, [
				createFailure(err0),
				createFailure(err1),
				createFailure(err2),
				createFailure(err3)
			])
		);
	});
});

describe('any', () => {
	it('should process an array of promises', async () => {
		const f = [
			createFailure('f0', MessageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(
			await any([
				Promise.resolve(createResult(0, [ f[0] ])),
				Promise.resolve(createResult(1, [ f[1] ])),
				Promise.resolve(createResult(2, [ f[2] ])),
				Promise.resolve(createResult(3, [ f[3] ]))
			]),
			createResult(0, f)
		);
		assert.deepStrictEqual(
			await any([
				Promise.resolve(f[0]),
				Promise.resolve(f[1]),
				Promise.resolve(f[2]),
				Promise.resolve(createResult(3, [ f[3] ]))
			]),
			createResult(3, f)
		);
		assert.deepStrictEqual(
			await any([
				Promise.resolve(f[0]),
				Promise.resolve(f[1]),
				Promise.resolve(f[2]),
				Promise.resolve(f[3])
			]),
			createFailure({ id : 'no result', failures : f }, MessageSeverity.error, f)
		);
	});

	it('should handle promise rejections', async () => {
		const err0 = new Error('foo');
		const err1 = new Error('bar');
		const err2 = new Error('baz');
		const err3 = new Error('qux');

		assert.deepStrictEqual(
			await any([
				Promise.reject(err0),
				Promise.resolve(createResult(1)),
				Promise.resolve(createResult(2)),
				Promise.resolve(createResult(3))
			]),
			createResult(1, [ createFailure(err0) ])
		);
		assert.deepStrictEqual(
			await any([
				Promise.reject(err0),
				Promise.reject(err1),
				Promise.reject(err2),
				Promise.reject(err3),
			]),
			createFailure({ id : 'no result', failures : [
				createFailure(err0),
				createFailure(err1),
				createFailure(err2),
				createFailure(err3)
			] }, MessageSeverity.error, [
				createFailure(err0),
				createFailure(err1),
				createFailure(err2),
				createFailure(err3)
			])
		);
	});
});
