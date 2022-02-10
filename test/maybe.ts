import * as assert from 'assert';
import { describe, it } from 'mocha';
import { createResult, failureSeverity, isFailure, isResult } from '../source';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('isResult', () => {
	it('should return true if a Maybe is a Result', () => {
		assert.strictEqual(isResult({ value : 1 }), true);
		assert.strictEqual(isResult({
			value : 1,
			failures : [{
				severity : failureSeverity.error,
				message : 'foo'
			}]
		}), true);
		assert.strictEqual(isResult({
			severity : failureSeverity.error,
			message : 'foo'
		}), false);
	});
});

describe('isFailure', () => {
	it('should return true if a Maybe is a Failure', () => {
		assert.strictEqual(isFailure({ value : 'foo' }), false);
		assert.strictEqual(isFailure({
			value : 'foo',
			failures : [{
				severity : failureSeverity.error,
				message : 'bar'
			}]
		}), false);
		assert.strictEqual(isFailure({
			severity : failureSeverity.error,
			message : 'foo'
		}), true);
	});
});

describe('createResult', () => {
	it('should create a Result', () => {
		const failure = {
			severity : failureSeverity.error,
			message : 'bar'
		};
		const result = createResult('foo', [ failure ]);

		assert.strictEqual(isResult(result), true);
		assert.deepStrictEqual(result, {
			value : 'foo',
			failures : [ failure ]
		});

		assert.deepStrictEqual(createResult('foo'), { value : 'foo', failures : [] });
	});
});
