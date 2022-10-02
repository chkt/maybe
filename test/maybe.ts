import * as assert from 'assert';
import { describe, it } from 'mocha';
import { createResult, failureSeverity, isFailure, isResult } from '../source';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('isResult', () => {
	it('should return true if a Maybe is a Result', () => {
		assert.strictEqual(isResult({ value : 1, messages : [] }), true);
		assert.strictEqual(isResult({
			value : 1,
			messages : [{
				severity : failureSeverity.error,
				message : 'foo',
				messages : []
			}]
		}), true);
		assert.strictEqual(isResult({
			severity : failureSeverity.error,
			message : 'foo',
			messages : []
		}), false);
	});
});

describe('isFailure', () => {
	it('should return true if a Maybe is a Failure', () => {
		assert.strictEqual(isFailure({ value : 'foo', messages : [] }), false);
		assert.strictEqual(isFailure({
			value : 'foo',
			messages : [{
				severity : failureSeverity.error,
				message : 'bar',
				messages : []
			}]
		}), false);
		assert.strictEqual(isFailure({
			severity : failureSeverity.error,
			message : 'foo',
			messages : []
		}), true);
	});
});

describe('createResult', () => {
	it('should create a Result', () => {
		const failure = {
			severity : failureSeverity.error,
			message : 'bar',
			messages : []
		};
		const result = createResult('foo', [ failure ]);

		assert.strictEqual(isResult(result), true);
		assert.deepStrictEqual(result, {
			value : 'foo',
			messages : [ failure ]
		});

		assert.deepStrictEqual(createResult('foo'), { value : 'foo', messages : [] });
	});
});
