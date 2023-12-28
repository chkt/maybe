import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { createFailure, createResult, isFailure, isResult, mergeMessagesAb, mergeMessagesBa } from '../source/maybe';
import { createMessage, messageSeverity } from '../source/message';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('isResult', () => {
	it('should return true if a Maybe is a Result', () => {
		assert.strictEqual(isResult({ value : 1, messages : [] }), true);
		assert.strictEqual(isResult({
			value : 1,
			messages : [{
				severity : messageSeverity.error,
				text : 'foo',
				messages : []
			}]
		}), true);
		assert.strictEqual(isResult({
			severity : messageSeverity.error,
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
				severity : messageSeverity.error,
				text : 'bar',
				messages : []
			}]
		}), false);
		assert.strictEqual(isFailure({
			severity : messageSeverity.error,
			text : 'foo',
			messages : []
		}), true);
	});
});

describe('createResult', () => {
	it('should create a Result', () => {
		const failure = {
			severity : messageSeverity.error,
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

describe('mergeMessagesAb', () => {
	it('should merge the messages of Maybe A and B', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f1, f0 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f3, f4 ]);

		assert.deepStrictEqual(mergeMessagesAb(f2, f5), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f5 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(r2, f5), {
			value : 'r2',
			messages : [ f1, f0, f5 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(f2, r5), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f3, f4 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(r2, r5), {
			value : 'r2',
			messages : [ f1, f0, f3, f4 ]
		});
	});
});

describe('mergeMessagesBa', () => {
	it('should merge the messages of Maybe B and A', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f1, f0 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f3, f4 ]);

		assert.deepStrictEqual(mergeMessagesBa(f2, f5), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f5, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(r2, f5), {
			value : 'r2',
			messages : [ f5, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(f2, r5), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f3, f4, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(r2, r5), {
			value : 'r2',
			messages : [ f3, f4, f1, f0 ]
		});
	});
});
