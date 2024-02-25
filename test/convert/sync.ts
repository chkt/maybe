import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, blank, may } from '../../source/convert/sync';
import { Maybe, createFailure, createResult } from '../../source/maybe';
import { messageSeverity } from '../../source/message';


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

		assert.deepStrictEqual(all(
			v => createResult(v, [ f[v] ]),
			[ 0, 1, 2, 3 ]
		), {
			value : [ 0, 1, 2, 3 ],
			messages : f
		});
		assert.deepStrictEqual(all(
			(v) : Maybe<number> => v % 2 ?
				createResult(v, [ f[v] ]) :
				createFailure(v, messageSeverity.warn, [ f[v] ]),
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
