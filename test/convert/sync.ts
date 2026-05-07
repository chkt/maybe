import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, any, blank, may } from '../../source/convert/sync.js';
import { createFailure, createResult } from '../../source/maybe.js';
import { messageSeverity } from '../../source/message.js';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('may', () => {
	it('should wrap a operation in a try/catch block', () => {
		assert.deepStrictEqual(
			may(() => createResult('foo'), undefined),
			createResult('foo')
		);
		assert.deepStrictEqual(
			may(value => createResult(`${ value }bar`), 'foo'),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			may(() => createFailure('foo', messageSeverity.warn), undefined),
			createFailure('foo', messageSeverity.warn)
		);
		assert.deepStrictEqual(
			may(value => createFailure(`${ value }bar`, messageSeverity.warn), 'foo'),
			createFailure('foobar', messageSeverity.warn)
		);
		assert.deepStrictEqual(
			may(() => { throw new Error('foo') }, undefined),
			createFailure(new Error('foo'))
		);
		assert.deepStrictEqual(
			may(value => { throw new Error(value) }, 'foo'),
			createFailure(new Error('foo'))
		);
	});
});

describe('all', () => {
	it('should process an array of values', () => {
		const f = [
			createFailure('f0', messageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(all([
			createResult(0, [ f[0] ]),
			createResult(1, [ f[1] ]),
			createResult(2, [ f[2] ]),
			createResult(3, [ f[3] ])
		]), {
			value : [ 0, 1, 2, 3 ],
			messages : f
		});
		assert.deepStrictEqual(all([
			createFailure(0, messageSeverity.warn, [ f[0] ]),
			createResult(1, [ f[1] ]),
			createFailure(2, messageSeverity.warn, [ f[2] ]),
			createResult(3, [ f[3] ]),
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
});

describe('any', () => {
	it('should process an array of values', () => {
		const f = [
			createFailure('f0', messageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(any([
			createResult(0, [ f[0] ]),
			createResult(1, [ f[1] ]),
			createResult(2, [ f[2] ]),
			createResult(3, [ f[3] ])
		]), {
			value : 0,
			messages : [ f[0] ]
		});
		assert.deepStrictEqual(any([
			createFailure(0, messageSeverity.warn, [ f[0] ]),
			createFailure(1, messageSeverity.warn, [ f[1] ]),
			createFailure(2, messageSeverity.warn, [ f[2] ]),
			createResult(3, [ f[3] ])
		]), {
			value : 3,
			messages : [ f[3] ]
		});
		assert.deepStrictEqual(any([
			createFailure(0, messageSeverity.warn, [ f[0] ]),
			createFailure(1, messageSeverity.warn, [ f[1] ]),
			createFailure(2, messageSeverity.warn, [ f[2] ]),
			createFailure(3, messageSeverity.warn, [ f[3] ])
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
});

describe('blank', () => {
	it('should void the value of a Result', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f0, f1 ]);

		assert.deepStrictEqual(blank(f2), f2);
		assert.deepStrictEqual(
			blank(createResult('foo', [ f1, f0 ])),
			createResult(undefined, [ f1, f0 ])
		);
	});
});
