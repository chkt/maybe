import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { createConversionFailure, isConversionFailure } from '../../source/convert/common.js';
import { MessageSeverity, createTextMessage } from '../../source/index.js';


describe('createConversionFailure', () => {
	it('should return a ConversionFailure', () => {
		assert.deepStrictEqual(
			createConversionFailure('foo', [ createTextMessage('bar'), createTextMessage('baz') ]),
			{
				data : {
					id : 'foo',
					failures : [ createTextMessage('bar'), createTextMessage('baz') ]
				},
				severity : MessageSeverity.error,
				messages : []
			}
		);
		assert.deepStrictEqual(
			createConversionFailure(
				'foo',
				[ createTextMessage('bar'), createTextMessage('baz') ],
				[ createTextMessage('qux') ]
			),
			{
				data : {
					id : 'foo',
					failures : [ createTextMessage('bar'), createTextMessage('baz') ]
				},
				severity : MessageSeverity.error,
				messages : [ createTextMessage('qux') ]
			}
		);
	});
});

describe('isConversionFailure', () => {
	it('should return true for ConversionFailures', () => {
		assert.strictEqual(isConversionFailure({ severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ code : 1, severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ text : 'foo', severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ error : new Error(), severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ data : { foo : 1 }, severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ data : { id : 'foo' }, severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ data : { failures : [] }, severity : MessageSeverity.error, messages : [] }), false);
		assert.strictEqual(isConversionFailure({ data : { id : 'foo', failures : [] }, severity : MessageSeverity.error, messages : [] }), true);
	});
});
