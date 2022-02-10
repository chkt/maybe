import * as assert from 'assert';
import { describe, it } from 'mocha';
import { failureSeverity } from '../source/failure';
import { tryMaybe, tryResolve } from '../source/try';


describe('tryMaybe', () => {
	it('should return a Maybe representing a try/catch', () => {
		assert.deepStrictEqual(
			tryMaybe(() => 'foo'),
			{ value : 'foo', failures : [] }
		);
		assert.deepStrictEqual(
			tryMaybe(() => { throw new Error('foo') }),
			{ severity : failureSeverity.error, error : new Error('foo') }
		);
	});
});

describe('tryResolve', () => {
	it('should return a Maybe Promise representing the result of a Promise', async () => {
		assert.deepStrictEqual(
			await tryResolve(async () => Promise.resolve('foo')),
			{ value : 'foo', failures : [] }
		);
		assert.deepStrictEqual(
			await tryResolve(async () => Promise.reject(new Error('foo'))),
			{ severity : failureSeverity.error, error : new Error('foo') }
		);
	});
});
