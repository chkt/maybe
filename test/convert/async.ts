import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { all } from '../../source/convert/async';
import { createFailure, createResult } from '../../source/maybe';
import { messageSeverity } from '../../source/message';


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
			async v => v % 2 ? createResult(v, [ f[v] ]) : createFailure(v, messageSeverity.warn, [ f[v] ]),
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
