import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all, resolve } from '../../source/convert/async';
import { Maybe, createFailure, createResult } from '../../source/maybe';
import { messageSeverity } from '../../source/message';


/* eslint-disable @typescript-eslint/no-magic-numbers */
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
	it('should process an Array of values', async () => {
		const f = [
			createFailure('f0', messageSeverity.warn, [ createFailure('f00') ]),
			createFailure('f1'),
			createFailure('f2'),
			createFailure('f3')
		];

		assert.deepStrictEqual(await all(
			async v => createResult(v, [ f[v] ]),
			[ 0, 1, 2, 3 ]
		), {
			value : [ 0, 1, 2, 3 ],
			messages : f
		});
		assert.deepStrictEqual(await all(
			async (v) : Promise<Maybe<number>> => v % 2 ?
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
