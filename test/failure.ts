import * as assert from 'assert';
import { describe, it } from 'mocha';
import {
	createCardinalFailure, createDataFailure,
	createErrorFailure, createFailure,
	createMessageFailure, failureSeverity, isCardinalFailure,
	isDataFailure,
	isErrorFailure,
	isMessageFailure,
	resolveFailureValue
} from '../source';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('isErrorFailure', () => {
	it('should return true if failure is a ErrorFailure', () => {
		assert.strictEqual(isErrorFailure({
			severity : failureSeverity.error,
			error : new Error('foo')
		}), true);
		assert.strictEqual(isErrorFailure({
			severity : failureSeverity.error,
			code : 1
		}), false);
		assert.strictEqual(isErrorFailure({
			severity : failureSeverity.error,
			message : 'foo'
		}), false);
		assert.strictEqual(isErrorFailure({
			severity : failureSeverity.error,
			data : { foo : 1 }
		}), false);
	});
});

describe('isCardinalFailure', () => {
	it('should return true if failure is a ErrorFailure', () => {
		assert.strictEqual(isCardinalFailure({
			severity : failureSeverity.error,
			error : new Error('foo')
		}), false);
		assert.strictEqual(isCardinalFailure({
			severity : failureSeverity.error,
			code : 1
		}), true);
		assert.strictEqual(isCardinalFailure({
			severity : failureSeverity.error,
			message : 'foo'
		}), false);
		assert.strictEqual(isCardinalFailure({
			severity : failureSeverity.error,
			data : { foo : 1 }
		}), false);
	});
});

describe('isMessageFailure', () => {
	it('should return true if failure is a ErrorFailure', () => {
		assert.strictEqual(isMessageFailure({
			severity : failureSeverity.error,
			error : new Error('foo')
		}), false);
		assert.strictEqual(isMessageFailure({
			severity : failureSeverity.error,
			code : 1
		}), false);
		assert.strictEqual(isMessageFailure({
			severity : failureSeverity.error,
			message : 'foo'
		}), true);
		assert.strictEqual(isMessageFailure({
			severity : failureSeverity.error,
			data : { foo : 1 }
		}), false);
	});
});

describe('isDataFailure', () => {
	it('should return true if failure is a ErrorFailure', () => {
		assert.strictEqual(isDataFailure({
			severity : failureSeverity.error,
			error : new Error('foo')
		}), false);
		assert.strictEqual(isDataFailure({
			severity : failureSeverity.error,
			code : 1
		}), false);
		assert.strictEqual(isDataFailure({
			severity : failureSeverity.error,
			message : 'foo'
		}), false);
		assert.strictEqual(isDataFailure({
			severity : failureSeverity.error,
			data : { foo : 1 }
		}), true);
	});
});

describe('createErrorFailure', () => {
	it('should create an ErrorFailure', () => {
		assert.strictEqual(isErrorFailure(createErrorFailure(new Error('foo'), failureSeverity.error)), true);
	});
});

describe('createCardinalFailure', () => {
	it('should create a CardinalFailure', () => {
		assert.strictEqual(isCardinalFailure(createCardinalFailure(1, failureSeverity.error)), true);
	});
});

describe('createMessageFailure', () => {
	it('should create a MessageFailure', () => {
		assert.strictEqual(isMessageFailure(createMessageFailure('foo', failureSeverity.error)), true);
	});
});

describe('createDataFailure', () => {
	it('should create a DataFailure', () => {
		assert.strictEqual(isDataFailure(createDataFailure({}, failureSeverity.error)), true);
	});
});

describe('createFailure', () => {
	it('should create Failure types according to input arguments', () => {
		assert.strictEqual(isErrorFailure(createFailure(new Error('foo'))), true);
		assert.strictEqual(isCardinalFailure(createFailure(1)), true);
		assert.strictEqual(isMessageFailure(createFailure('foo')), true);
		assert.strictEqual(isDataFailure(createFailure({ foo : 1 })), true);
	});
});

describe('resolveFailureValue', () => {
	it('should return the value of a Failure', () => {
		const err = new Error('foo');
		const obj = { foo : 1 };

		assert.strictEqual(resolveFailureValue(createErrorFailure(err)), err);
		assert.strictEqual(resolveFailureValue(createCardinalFailure(1)), 1);
		assert.strictEqual(resolveFailureValue(createFailure('foo')), 'foo');
		assert.strictEqual(resolveFailureValue(createFailure(obj)), obj);
	});
});
