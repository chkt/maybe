import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as failure from '../source/failure';
import * as maybe from '../source/maybe';
import * as tryMaybe from '../source/try';
import * as root from '../source';


/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-magic-numbers */
describe('failure api', () => {
	it('should contain exposed interfaces', () => {
		const a:root.FailureSeverity = 0;
		const b:root.ErrorFailure = { severity : 0, error : new Error() };
		const c:root.CardinalFailure = { severity : 0, code : 1 };
		const d:root.MessageFailure = { severity : 0, message : 'foo' };
		const e:root.DataFailure<{ foo : number }> = { severity : 0, data : { foo : 1 }};
		let f:root.Failure = b;

		f = c;
		f = d;
		f = e;

		const g:failure.FailureSeverity = a;
		const h:failure.ErrorFailure = b;
		const i:failure.CardinalFailure = c;
		const j:failure.MessageFailure = d;
		const k:failure.DataFailure<{ foo : number }> = e;
		const l:root.Failures = [{ severity : 0, message : 'foo' }];
		const m:failure.Failures = l;
	});

	it('should contain exposed enums', () => {
		assert.strictEqual(root.failureSeverity.error, failure.failureSeverity.error);
	});

	it('should contain exposed methods', () => {
		assert.strictEqual(root.isErrorFailure, failure.isErrorFailure);
		assert.strictEqual(root.isCardinalFailure, failure.isCardinalFailure);
		assert.strictEqual(root.isMessageFailure, failure.isMessageFailure);
		assert.strictEqual(root.isDataFailure, failure.isDataFailure);
		assert.strictEqual(root.createErrorFailure, failure.createErrorFailure);
		assert.strictEqual(root.createCardinalFailure, failure.createCardinalFailure);
		assert.strictEqual(root.createMessageFailure, failure.createMessageFailure);
		assert.strictEqual(root.createDataFailure, failure.createDataFailure);
		assert.strictEqual(root.createFailure, failure.createFailure);
		assert.strictEqual(root.resolveFailureValue, failure.resolveFailureValue);
	});
});

describe('result api', () => {
	it('should contain exposed interfaces', () => {
		const a:root.Result<{ foo : 1 }> = { value : { foo : 1 }};
		const b:root.Maybe<{ foo : 1 }> = { value : { foo : 1 }};
		const c:root.Maybe<{ foo : 1 }> = { severity : 0, message : 'foo' };
		const d:maybe.Result<{ foo : 1 }> = a;
		const e:maybe.Maybe<{ foo : 1 }> = b;
		const f:maybe.Maybe<{ foo : 1 }> = c;
	});

	it('should contain exposed methods', () => {
		assert.strictEqual(root.isResult, maybe.isResult);
		assert.strictEqual(root.isFailure, maybe.isFailure);
		assert.strictEqual(root.createResult, maybe.createResult);
	});
});

describe('try api', () => {
	it('should contain exposed methods', () => {
		assert.strictEqual(root.tryMaybe, tryMaybe.tryMaybe);
		assert.strictEqual(root.tryResolve, tryMaybe.tryResolve);
	});
});
