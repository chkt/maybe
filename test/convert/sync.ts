import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, may } from '../../source/convert/sync';
import { createFailure, createResult } from '../../source/maybe';
import { messageSeverity } from '../../source/message';


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

		assert.deepStrictEqual(all(
			v => createResult(v, [ f[v] ]),
			[ 0, 1, 2, 3 ]
		), {
			value : [ 0, 1, 2, 3 ],
			messages : f
		});
		assert.deepStrictEqual(all(
			v => v % 2 ? createResult(v, [ f[v] ]) : createFailure(v, messageSeverity.warn, [ f[v] ]),
			[ 0, 1, 2, 3 ]
		), {
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