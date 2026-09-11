import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import {
	Message,
	MessageComposite,
	MessageSeverity,
	Messages,
	NullMessage,
	containsMessage,
	createCardinalMessage,
	createDataMessage,
	createErrorMessage,
	createMessage,
	createTextMessage,
	flattenMessage,
	flattenMessages,
	isCardinalMessage,
	isDataMessage,
	isErrorMessage,
	isMessage,
	isNullValue,
	isTextMessage,
	mergeCompositeAb,
	mergeCompositeBa,
	mergeMessagesAb,
	mergeMessagesBa,
	resolveMessageValue
} from '../source/message.js';


/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('isMessage', () => {
	it('should return true if a MessageComposite is also a Message', () => {
		assert.strictEqual(isMessage({ messages : [] }), false);
		assert.strictEqual(isMessage({ messages : [], severity : MessageSeverity.error } as NullMessage), true);
		assert.strictEqual(isMessage(createCardinalMessage(1)), true);
		assert.strictEqual(isMessage(createTextMessage('foo')), true);
		assert.strictEqual(isMessage(createErrorMessage(new Error('foo'))), true);
		assert.strictEqual(isMessage(createDataMessage({ foo : 1 })), true);
	});
});

describe('isErrorMessage', () => {
	it('should return true if message is an ErrorMessage', () => {
		assert.strictEqual(isErrorMessage({
			severity : MessageSeverity.error,
			messages : [],
			error : new Error('foo')
		}), true);
		assert.strictEqual(isErrorMessage({
			severity : MessageSeverity.error,
			messages : [],
			code : 1
		}), false);
		assert.strictEqual(isErrorMessage({
			severity : MessageSeverity.error,
			messages : [],
			text : 'foo'
		}), false);
		assert.strictEqual(isErrorMessage({
			severity : MessageSeverity.error,
			messages : [],
			data : { foo : 1 }
		}), false);
	});

	it('should guard a ErrorMessage', () => {
		const error = new Error();
		const a:Message = { error, severity : MessageSeverity.warn, messages : [] };
		const b:Message = { code : 1, severity : MessageSeverity.warn, messages : [] };
		const c:Message = { text : 'foo', severity : MessageSeverity.warn, messages : [] };
		const d:Message = { data : { value : 1 }, severity : MessageSeverity.warn, messages : [] };
		const e:Message = { data : { foo : 1 }, severity : MessageSeverity.warn, messages : [] };

		assert.strictEqual(isErrorMessage(a) ? a.error : false, error);
		assert.strictEqual(isErrorMessage(b) ? b.error : false, false);
		assert.strictEqual(isErrorMessage(c) ? c.error : false, false);
		assert.deepStrictEqual(isErrorMessage(d) ? d.error : false, false);
		assert.deepStrictEqual(isErrorMessage(e) ? e.error : false, false);
	});
});

describe('isCardinalMessage', () => {
	it('should return true if message is a CardinalMessage', () => {
		assert.strictEqual(isCardinalMessage({
			severity : MessageSeverity.error,
			messages : [],
			error : new Error('foo')
		}), false);
		assert.strictEqual(isCardinalMessage({
			severity : MessageSeverity.error,
			messages : [],
			code : 1
		}), true);
		assert.strictEqual(isCardinalMessage({
			severity : MessageSeverity.error,
			messages : [],
			text : 'foo'
		}), false);
		assert.strictEqual(isCardinalMessage({
			severity : MessageSeverity.error,
			messages : [],
			data : { foo : 1 }
		}), false);
	});

	it('should guard a CardinalMessage', () => {
		const a:Message = { error : new Error(), severity : MessageSeverity.warn, messages : [] };
		const b:Message = { code : 1, severity : MessageSeverity.warn, messages : [] };
		const c:Message = { text : 'foo', severity : MessageSeverity.warn, messages : [] };
		const d:Message = { data : { value : 1 }, severity : MessageSeverity.warn, messages : [] };
		const e:Message = { data : { foo : 1 }, severity : MessageSeverity.warn, messages : [] };

		assert.strictEqual(isCardinalMessage(a) ? a.code : false, false);
		assert.strictEqual(isCardinalMessage(b) ? b.code : false, 1);
		assert.strictEqual(isCardinalMessage(c) ? c.code : false, false);
		assert.strictEqual(isCardinalMessage(d) ? d.code : false, false);
		assert.strictEqual(isCardinalMessage(e) ? e.code : false, false);
	});
});

describe('isTextMessage', () => {
	it('should return true if message is a TextMessage', () => {
		assert.strictEqual(isTextMessage({
			severity : MessageSeverity.error,
			messages : [],
			error : new Error('foo')
		}), false);
		assert.strictEqual(isTextMessage({
			severity : MessageSeverity.error,
			messages : [],
			code : 1
		}), false);
		assert.strictEqual(isTextMessage({
			severity : MessageSeverity.error,
			messages : [],
			text : 'foo'
		}), true);
		assert.strictEqual(isTextMessage({
			severity : MessageSeverity.error,
			messages : [],
			data : { foo : 1 }
		}), false);
	});

	it('should guard a TextMessage', () => {
		const a:Message = { error : new Error(), severity : MessageSeverity.warn, messages : [] };
		const b:Message = { code : 1, severity : MessageSeverity.warn, messages : [] };
		const c:Message = { text : 'foo', severity : MessageSeverity.warn, messages : [] };
		const d:Message = { data : { value : 1 }, severity : MessageSeverity.warn, messages : [] };
		const e:Message = { data : { foo : 1 }, severity : MessageSeverity.warn, messages : [] };

		assert.strictEqual(isTextMessage(a) ? a.text : false, false);
		assert.strictEqual(isTextMessage(b) ? b.text : false, false);
		assert.strictEqual(isTextMessage(c) ? c.text : false, c.text);
		assert.strictEqual(isTextMessage(d) ? d.text : false, false);
		assert.strictEqual(isTextMessage(e) ? e.text : false, false);
	});
});

describe('isDataMessage', () => {
	it('should return true if message is a DataMessage', () => {
		assert.strictEqual(isDataMessage({
			severity : MessageSeverity.error,
			messages : [],
			error : new Error('foo')
		}), false);
		assert.strictEqual(isDataMessage({
			severity : MessageSeverity.error,
			messages : [],
			code : 1
		}), false);
		assert.strictEqual(isDataMessage({
			severity : MessageSeverity.error,
			messages : [],
			text : 'foo'
		}), false);
		assert.strictEqual(isDataMessage({
			severity : MessageSeverity.error,
			messages : [],
			data : { foo : 1 }
		}), true);
	});

	it('should guard a DataMessage', () => {
		const a:Message = { error : new Error(), severity : MessageSeverity.warn, messages : [] };
		const b:Message = { code : 1, severity : MessageSeverity.warn, messages : [] };
		const c:Message = { text : 'foo', severity : MessageSeverity.warn, messages : [] };
		const d:Message = { data : { value : 1 }, severity : MessageSeverity.warn, messages : [] };
		const e:Message = { data : { foo : 1 }, severity : MessageSeverity.warn, messages : [] };

		assert.strictEqual(isDataMessage(a) ? a.data : false, false);
		assert.strictEqual(isDataMessage(b) ? b.data : false, false);
		assert.strictEqual(isDataMessage(c) ? c.data : false, false);
		assert.deepStrictEqual(isDataMessage(d) ? d.data : false, { value : 1 });
		assert.deepStrictEqual(isDataMessage(e) ? e.data : false, { foo : 1 });
	});
});

describe('createErrorMessage', () => {
	it('should create an ErrorFailure', () => {
		const error = new Error('foo');
		const children:Messages = [{
			code : 1,
			severity : MessageSeverity.error,
			messages : []
		}];

		assert.deepStrictEqual(createErrorMessage(error), {
			error,
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createErrorMessage(error, MessageSeverity.warn), {
			error,
			severity : MessageSeverity.warn,
			messages : []
		});
		assert.deepStrictEqual(createErrorMessage(error, MessageSeverity.warn, children), {
			error,
			severity : MessageSeverity.warn,
			messages : children
		});
	});
});

describe('createCardinalMessage', () => {
	it('should create an CardinalFailure', () => {
		const children:Messages = [{
			code : 1,
			severity : MessageSeverity.error,
			messages : []
		}];

		assert.deepStrictEqual(createCardinalMessage(2), {
			code : 2,
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createCardinalMessage(2, MessageSeverity.warn), {
			code : 2,
			severity : MessageSeverity.warn,
			messages : []
		});
		assert.deepStrictEqual(createCardinalMessage(2, MessageSeverity.warn, children), {
			code : 2,
			severity : MessageSeverity.warn,
			messages : children
		});
	});
});

describe('createTextMessage', () => {
	it('should create a TextMessage', () => {
		const children:Messages = [{
			code : 1,
			severity : MessageSeverity.error,
			messages : []
		}];

		assert.deepStrictEqual(createTextMessage('foo'), {
			text : 'foo',
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createTextMessage('foo', MessageSeverity.warn), {
			text : 'foo',
			severity : MessageSeverity.warn,
			messages : []
		});
		assert.deepStrictEqual(createTextMessage('foo', MessageSeverity.warn, children), {
			text : 'foo',
			severity : MessageSeverity.warn,
			messages : children
		});
	});
});

describe('createDataMessage', () => {
	it('should create a DataMessage', () => {
		const error = new Error('foo');
		const children:Messages = [{
			code : 1,
			severity : MessageSeverity.error,
			messages : []
		}];

		assert.deepStrictEqual(createDataMessage({ foo : 1 }), {
			data : { foo : 1 },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage({ foo : 1 }, MessageSeverity.warn), {
			data : { foo : 1 },
			severity : MessageSeverity.warn,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage({ foo : 1 }, MessageSeverity.warn, children), {
			data : { foo : 1 },
			severity : MessageSeverity.warn,
			messages : children
		});
		assert.deepStrictEqual(createDataMessage(1), {
			data : { value : 1 },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage('foo'), {
			data : { value : 'foo' },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage(error), {
			data : { value : error },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage([ 'foo' ]), {
			data : { value : [ 'foo' ] },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createDataMessage(null), {
			data : { value : null },
			severity : MessageSeverity.error,
			messages : []
		});
	});
});

describe('createMessage', () => {
	it('should create a Message according to input argument', () => {
		const error = new Error('foo');

		assert.deepStrictEqual(createMessage(null), {
			data : { value : null },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage(true), {
			data : { value : true },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage(1), {
			code : 1,
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage(1.1), {
			data : { value : 1.1 },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage('foo'), {
			text : 'foo',
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage({ foo : 1 }), {
			data : { foo : 1 },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage([ 'foo' ]), {
			data : { value : [ 'foo' ] },
			severity : MessageSeverity.error,
			messages : []
		});
		assert.deepStrictEqual(createMessage(error), {
			error,
			severity : MessageSeverity.error,
			messages : []
		});
	});
});

describe('resolveMessageValue', () => {
	it('should return the value of a message', () => {
		const error = new Error('foo');
		const data = { foo : 1 };

		assert.strictEqual(resolveMessageValue(createErrorMessage(error)), error);
		assert.strictEqual(resolveMessageValue(createCardinalMessage(1)), 1);
		assert.strictEqual(resolveMessageValue(createTextMessage('foo')), 'foo');
		assert.strictEqual(resolveMessageValue(createDataMessage(data)), data);
	});

	it('should return NULL_VALUE for NullMessages', () => {
		assert.strictEqual(isNullValue(resolveMessageValue({ severity : MessageSeverity.error, messages : [] })), true);
	});
});

describe('containsMessage', () => {
	it('should return true if a message is included', () => {
		const m = createMessage('foo');
		const m0 = createMessage('m0');
		const m1 = createMessage('m1');
		const m2 = createMessage('m2', MessageSeverity.error, [ m ]);
		const m3 = createMessage('m3', MessageSeverity.error, [ m0, m1 ]);

		assert.strictEqual(
			containsMessage(createMessage('bar', MessageSeverity.error, [ m0, m1 ]), m),
			false
		);
		assert.strictEqual(
			containsMessage(createMessage('bar', MessageSeverity.error, [ m0, m1, m ]), m),
			true
		);
		assert.strictEqual(
			containsMessage(createMessage('bar', MessageSeverity.error, [ m0, m1, m2 ]), m),
			true
		);
		assert.strictEqual(
			containsMessage(createMessage('bar', MessageSeverity.error, [ m0, m1, m3 ]), m),
			false
		);
	});

	it('should detect reference loops', () => {
		const children:Message[] = [];
		const m0 = createTextMessage('foo', MessageSeverity.error, children);
		const m1 = createTextMessage('bar', MessageSeverity.error, [ m0 ]);
		const m2 = createTextMessage('baz');

		children.push(m1);

		assert.deepStrictEqual(containsMessage(m0, m2), false);
	});
});

describe('flattenMessages', () => {
	it('should flatten a tree of messages', () => {
		const m0 = createMessage('m0');
		const m1 = createMessage('m1');
		const m2 = createMessage('m2', MessageSeverity.warn, [ m1, m0 ]);
		const m3 = createMessage('m3');
		const m4 = createMessage('m4', MessageSeverity.warn, [ m3 ]);
		const m5 = createMessage('m5');
		const m6 = createMessage('m6', MessageSeverity.warn, [ m5, m4, m3, m2, m1, m0 ]);

		assert.deepStrictEqual(
			flattenMessages([ m6 ]),
			[ m0, m1, m2, m3, m4, m5, m6 ]
		);
	});

	it('should detect reference loops', () => {
		const children:Message[] = [];
		const m0 = createTextMessage('m0', MessageSeverity.error, children);
		const m1 = createTextMessage('m1', MessageSeverity.error, [ m0 ]);

		children.push(m1);

		assert.deepStrictEqual(
			flattenMessages([ m0 ]),
			[ m1, m0 ]
		);
	});
});

describe('flattenMessage', () => {
	it('should flatten a message', () => {
		const m0 = createMessage('m0');
		const m1 = createMessage('m1');
		const m2 = createMessage('m2', MessageSeverity.warn, [ m1, m0 ]);
		const m3 = createMessage('m3');
		const m4 = createMessage('m4', MessageSeverity.warn, [ m3 ]);
		const m5 = createMessage('m5');
		const m6 = createMessage('m6', MessageSeverity.warn, [ m5, m4, m3, m2, m1, m0 ]);

		assert.deepStrictEqual(
			flattenMessage(m6),
			[ m0, m1, m2, m3, m4, m5, m6 ]
		);
	});

	it('should detect reference loops', () => {
		const children:Message[] = [];
		const m0 = createTextMessage('m0', MessageSeverity.error, children);
		const m1 = createTextMessage('m1', MessageSeverity.error, [ m0 ]);

		children.push(m1);

		assert.deepStrictEqual(
			flattenMessage(m1),
			[ m0, m1 ]
		);
	});
});

describe('mergeCompositeAb', () => {
	it('should merge the messages of composite a and b', () => {
		const m0 = createMessage('m0');
		const m1 = createMessage('m1');
		const m2 = createMessage('m2', MessageSeverity.warn, [ m0, m1 ]);
		const m3 = createMessage('m3');
		const m4 = createMessage('m4');
		const m5 = createMessage('m5', MessageSeverity.warn, [ m3, m4 ]);

		assert.deepStrictEqual(mergeCompositeAb(
			{ messages : [ m0, m1 ] },
			{ messages : [ m3, m4 ] }
		), {
			messages : [ m0, m1, m3, m4 ]
		});
		assert.deepStrictEqual(mergeCompositeAb(
			{ messages : [ m2 ] },
			{ messages : [ m5 ] }
		), {
			messages : [ m2, m5 ]
		});
		assert.deepStrictEqual(mergeCompositeAb(
			{ foo : 'bar', messages : [ m0 ] },
			{ foo : 'baz', messages : [ m1 ] } as MessageComposite
		), {
			foo : 'bar',
			messages : [ m0, m1 ]
		});
	});
});

describe('mergeCompositeBa', () => {
	it('should merge the messages of composite b and a', () => {
		const m0 = createMessage('m0');
		const m1 = createMessage('m1');
		const m2 = createMessage('m2', MessageSeverity.warn, [ m0, m1 ]);
		const m3 = createMessage('m3');
		const m4 = createMessage('m4');
		const m5 = createMessage('m5', MessageSeverity.warn, [ m3, m4 ]);

		assert.deepStrictEqual(mergeCompositeBa(
			{ messages : [ m0, m1 ] },
			{ messages : [ m3, m4 ] }
		), {
			messages : [ m3, m4, m0, m1 ]
		});
		assert.deepStrictEqual(mergeCompositeBa(
			{ messages : [ m2 ] },
			{ messages : [ m5 ] }
		), {
			messages : [ m5, m2 ]
		});
		assert.deepStrictEqual(mergeCompositeBa(
			{ foo : 'bar', messages : [ m0 ] },
			{ foo : 'baz', messages : [ m1 ] } as MessageComposite
		), {
			foo : 'bar',
			messages : [ m1, m0 ]
		});
	});
});

describe('mergeMessagesAb', () => {
	it('should merge the messages of MessageComposite A and B', () => {
		const f0 = createMessage('f0');
		const f1 = createMessage('f1');
		const f2 = createMessage('f2', MessageSeverity.warn, [ f1, f0 ]);
		const r2 = { messages : [ f1, f0 ] };
		const f3 = createMessage('f3');
		const f4 = createMessage('f4');
		const f5 = createMessage('f5', MessageSeverity.warn, [ f3, f4 ]);
		const r5 = { messages : [ f3, f4 ] };

		assert.deepStrictEqual(mergeMessagesAb(f2, f5), {
			text : 'f2',
			severity : MessageSeverity.warn,
			messages : [ f1, f0, f5 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(r2, f5), {
			messages : [ f1, f0, f5 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(f2, r5), {
			text : 'f2',
			severity : MessageSeverity.warn,
			messages : [ f1, f0, f3, f4 ]
		});
		assert.deepStrictEqual(mergeMessagesAb(r2, r5), {
			messages : [ f1, f0, f3, f4 ]
		});
	});

	it('should return A if A and B are identical', () => {
		const f0 = createMessage('f0');

		assert.deepStrictEqual(mergeMessagesAb(f0, f0), f0);
	});
});

describe('mergeMessagesBa', () => {
	it('should merge the messages of Maybe B and A', () => {
		const f0 = createMessage('f0');
		const f1 = createMessage('f1');
		const f2 = createMessage('f2', MessageSeverity.warn, [ f1, f0 ]);
		const r2 = { messages : [ f1, f0 ] };
		const f3 = createMessage('f3');
		const f4 = createMessage('f4');
		const f5 = createMessage('f5', MessageSeverity.warn, [ f3, f4 ]);
		const r5 = { messages : [ f3, f4 ] };

		assert.deepStrictEqual(mergeMessagesBa(f2, f5), {
			text : 'f2',
			severity : MessageSeverity.warn,
			messages : [ f5, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(r2, f5), {
			messages : [ f5, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(f2, r5), {
			text : 'f2',
			severity : MessageSeverity.warn,
			messages : [ f3, f4, f1, f0 ]
		});
		assert.deepStrictEqual(mergeMessagesBa(r2, r5), {
			messages : [ f3, f4, f1, f0 ]
		});
	});

	it('should return A if A and B are identical', () => {
		const f0 = createMessage('f0');

		assert.deepStrictEqual(mergeMessagesBa(f0, f0), f0);
	});
});
