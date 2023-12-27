import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { processFailure, processValue } from '../../source';
import { and, onFailure, onResult, or } from '../../source/flow/sync';
import { createFailure, createResult } from '../../source/maybe';
import { messageSeverity, resolveMessageValue } from '../../source/message';


describe('and', () => {
	it('should process a Result', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');

		const resFn:processValue<string, string> =
			value => createResult(
				`${ value }bar`,
				[ f2, f3 ]
			);
		const failFn:processValue<string, never> =
			value => createFailure(
				`${ value }baz`,
				messageSeverity.fatal,
				[ f2, f3 ]
			);

		assert.deepStrictEqual(
			and(resFn, createResult('foo', [ f0, f1 ])),
			createResult('foobar', [ f0, f1, f2, f3 ])
		);
		assert.deepStrictEqual(
			and(failFn, createResult('foo', [ f0, f1 ])),
			createFailure('foobaz', messageSeverity.fatal, [ f0, f1, f2, f3 ])
		);
		assert.deepStrictEqual(
			and(resFn, createFailure('bang', messageSeverity.warn, [ f1, f0 ])),
			createFailure('bang', messageSeverity.warn, [ f1, f0 ])
		);
		assert.deepStrictEqual(
			and(failFn, createFailure('bang', messageSeverity.warn, [ f1, f0 ])),
			createFailure('bang', messageSeverity.warn, [ f1, f0 ])
		);
	});
});

describe('or', () => {
	it('should process a Failure', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');
		const f = createFailure('foo', messageSeverity.warn, [ f0, f1 ]);

		const resFn:processFailure<string, string> =
			value => createResult(
				`${ String(resolveMessageValue(value)) }bar`,
				[ f2, f3 ]
			);
		const failFn:processFailure<string, string> =
			value => createFailure(
				`${ String(resolveMessageValue(value)) }baz`,
				messageSeverity.fatal,
				[ f2, f3 ]
			);

		assert.deepStrictEqual(
			or(resFn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			or(failFn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			or(resFn, f),
			createResult('foobar', [ f, f2, f3 ])
		);
		assert.deepStrictEqual(
			or(failFn, f),
			createFailure('foobaz', messageSeverity.fatal, [ f, f2, f3 ])
		);
	});
});

describe('onResult', () => {
	it('should call a function for Results', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f0, f1 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f4, f3 ]);

		assert.deepStrictEqual(onResult(() => r5, r2), {
			value : 'r2',
			messages : [ f0, f1, f4, f3 ]
		});
		assert.deepStrictEqual(onResult(() => f5, r2), {
			value : 'r2',
			messages : [ f0, f1, f5 ]
		});
		assert.deepStrictEqual(onResult(() => r5, f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0 ]
		});
		assert.deepStrictEqual(onResult(() => f5, f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0 ]
		});
	});
});

describe('onFailure', () => {
	it('should call a function for Failures', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f0, f1 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f4, f3 ]);

		assert.deepStrictEqual(onFailure(() => r5, r2), {
			value : 'r2',
			messages : [ f0, f1 ]
		});
		assert.deepStrictEqual(onFailure(() => f5, r2), {
			value : 'r2',
			messages : [ f0, f1 ]
		});
		assert.deepStrictEqual(onFailure(() => r5, f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f4, f3 ]
		});
		assert.deepStrictEqual(onFailure(() => f5, f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f5 ]
		});
	});
});
