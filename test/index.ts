import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import * as compose from '../source/compose.js';
import * as convert from '../source/convert/index.js';
import * as flow from '../source/flow/index.js';
import * as root from '../source/index.js';
import * as maybe from '../source/maybe.js';
import * as message from '../source/message.js';
import * as native from '../source/native/index.js';


/* eslint-disable @typescript-eslint/no-unused-vars */
describe('message api', () => {
	it('should contain exposed interfaces', () => {
		const a:root.MessageSeverity = 0;
		const b:root.ErrorMessage = { severity : 0, error : new Error(), messages : [] };
		const c:root.CardinalMessage = { severity : 0, code : 1, messages : [] };
		const d:root.TextMessage = { severity : 0, text : 'foo', messages : [] };
		const e:root.DataMessage<{ foo : number }> = { severity : 0, data : { foo : 1 }, messages : [] };
		let _f:root.Message<Error | { foo : number }> = b;

		_f = c;
		_f = d;
		_f = e;

		const _g:message.MessageSeverity = a;
		const _h:message.ErrorMessage = b;
		const _i:message.CardinalMessage = c;
		const _j:message.TextMessage = d;
		const _k:message.DataMessage<{ foo : number }> = e;
		const l:root.Messages = [{ severity : 0, text : 'foo', messages : [] }];
		const _m:message.Messages = l;
	});

	it('should contain exposed enums', () => {
		assert.strictEqual(root.messageSeverity.error, message.messageSeverity.error);
	});

	it('should contain exposed methods', () => {
		assert.strictEqual(root.isErrorMessage, message.isErrorMessage);
		assert.strictEqual(root.isCardinalMessage, message.isCardinalMessage);
		assert.strictEqual(root.isTextMessage, message.isTextMessage);
		assert.strictEqual(root.isDataMessage, message.isDataMessage);
		assert.strictEqual(root.createErrorMessage, message.createErrorMessage);
		assert.strictEqual(root.createCardinalMessage, message.createCardinalMessage);
		assert.strictEqual(root.createTextMessage, message.createTextMessage);
		assert.strictEqual(root.createDataMessage, message.createDataMessage);
		assert.strictEqual(root.createMessage, message.createMessage);
		assert.strictEqual(root.resolveMessageValue, message.resolveMessageValue);
		assert.strictEqual(root.containsMessage, message.containsMessage);
		assert.strictEqual(root.flattenMessage, message.flattenMessage);
		assert.strictEqual(root.flattenMessages, message.flattenMessages);
	});
});

describe('result api', () => {
	it('should contain exposed interfaces', () => {
		const a:root.Failure<Error> = { error : new Error(), severity : message.messageSeverity.warn, messages : [] };
		const b:root.Result<{ foo : 1 }> = { value : { foo : 1 }, messages : [] };
		const c:root.Maybe<{ foo : 1 }> = { value : { foo : 1 }, messages : [] };
		const d:root.Maybe<{ foo : 1 }> = { text : 'foo', severity : message.messageSeverity.warn, messages : [] };
		const _e:maybe.Failure<Error> = a;
		const _f:maybe.Result<{ foo : 1 }> = b;
		const _g:maybe.Maybe<{ foo : 1 }> = c;
		const _h:maybe.Maybe<{ foo : 1 }> = d;
	});

	it('should contain exposed methods', () => {
		assert.strictEqual(root.isResult, maybe.isResult);
		assert.strictEqual(root.isFailure, maybe.isFailure);
		assert.strictEqual(root.createResult, maybe.createResult);
		assert.strictEqual(root.createFailure, maybe.createFailure);
	});
});

describe('native api', () => {
	it('should contain exposed methods', () => {
		assert.strictEqual(root.filterAll, native.filterAll);
		assert.strictEqual(root.maybeFrom, native.maybeFrom);
		assert.strictEqual(root.maybeAsync, native.maybeAsync);
		assert.strictEqual(root.resultFrom, native.resultFrom);
		assert.strictEqual(root.resultAsync, native.resultAsync);
		assert.strictEqual(root.failureFrom, native.failureFrom);
		assert.strictEqual(root.failureAsync, native.failureAsync);
	});
});

describe('conversion api', () => {
	it('should contain exposed methods', () => {
		assert.strictEqual(root.all, convert.all);
		assert.strictEqual(root.allAsync, convert.allAsync);
		assert.strictEqual(root.any, convert.any);
		assert.strictEqual(root.anyAsync, convert.anyAsync);
		assert.strictEqual(root.may, convert.may);
		assert.strictEqual(root.mayAsync, convert.mayAsync);
		assert.strictEqual(root.resolve, convert.resolve);
		assert.strictEqual(root.blank, convert.blank);
	});
});

describe('flow api', () => {
	it('should contain exposed methods', () => {
		assert.strictEqual(root.and, flow.and);
		assert.strictEqual(root.andAsync, flow.andAsync);
		assert.strictEqual(root.or, flow.or);
		assert.strictEqual(root.orAsync, flow.orAsync);
		assert.strictEqual(root.resultIf, flow.resultIf);
		assert.strictEqual(root.resultIfAsync, flow.resultIfAsync);
		assert.strictEqual(root.failureIf, flow.failureIf);
		assert.strictEqual(root.failureIfAsync, flow.failureIfAsync);
		assert.strictEqual(root.onResult, flow.onResult);
		assert.strictEqual(root.onResultAsync, flow.onResultAsync);
		assert.strictEqual(root.onFailure, flow.onFailure);
		assert.strictEqual(root.onFailureAsync, flow.onFailureAsync);
	});
});

describe('composition api', () => {
	it('should contain exposed methods', () => {
		assert.strictEqual(root.apply, compose.apply);
	});
});
