import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { createFailure, createResult, isFailure, isResult } from '../source/maybe.js';
import { MessageSeverity, createMessage } from '../source/message.js';


describe('isResult', () => {
	it('should return true if a Maybe is a Result', () => {
		assert.strictEqual(isResult({ value : 1, messages : [] }), true);
		assert.strictEqual(isResult({
			value : 1,
			messages : [{
				severity : MessageSeverity.error,
				text : 'foo',
				messages : []
			}]
		}), true);
		assert.strictEqual(isResult({
			severity : MessageSeverity.error,
			text : 'foo',
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
				severity : MessageSeverity.error,
				text : 'bar',
				messages : []
			}]
		}), false);
		assert.strictEqual(isFailure({
			severity : MessageSeverity.error,
			text : 'foo',
			messages : []
		}), true);
	});
});

describe('createResult', () => {
	it('should create a Result', () => {
		const failure = {
			severity : MessageSeverity.error,
			text : 'bar',
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

describe('createFailure', () => {
	it('should alias createMessage', () => {
		assert.strictEqual(createFailure, createMessage);
	});
});
