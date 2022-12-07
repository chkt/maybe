import * as assert from 'assert';
import { describe, it } from 'mocha';
import { createFailure, failureSeverity, resolveFailureValue } from '../source/failure';
import { createResult } from '../source/maybe';
import { and, apply, may, or, processFailure, processValue, resolve } from '../source/flow';


describe('apply', () => {
	it('should apply f() to g()', () => {
		function a(v:boolean) : number {
			return Number(v);
		}

		function b(fn:(v:boolean) => number, value:boolean) : string {
			return `${ fn(value).toFixed(0) }-bar`;
		}

		function c(fn:(v:boolean) => string, value:boolean) : { value : string } {
			return { value : fn(value) };
		}

		const ab = apply(b, a);
		const abc = apply(c, ab);

		assert.strictEqual(ab(false), '0-bar');
		assert.strictEqual(ab(true), '1-bar');
		assert.deepStrictEqual(abc(false), { value : '0-bar' });
		assert.deepStrictEqual(abc(true), { value : '1-bar' });
	});
});

describe('and', () => {
	it('should process a Result', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');

		const resfn:processValue<string, string> = value => createResult(`${ value }bar`, [ f2, f3 ]);
		const failfn:processValue<string, never> = value => createFailure(
			`${ value }baz`,
			failureSeverity.fatal,
			[ f2, f3 ]
		);

		assert.deepStrictEqual(
			and(resfn, createResult('foo', [ f0, f1 ])),
			createResult('foobar', [ f2, f3, f0, f1 ])
		);
		assert.deepStrictEqual(
			and(failfn, createResult('foo', [ f0, f1 ])),
			createFailure('foobaz', failureSeverity.fatal, [ f2, f3, f0, f1 ])
		);
		assert.deepStrictEqual(
			and(resfn, createFailure('bang', failureSeverity.warn, [ f1, f0 ])),
			createFailure('bang', failureSeverity.warn, [ f1, f0 ])
		);
		assert.deepStrictEqual(
			and(failfn, createFailure('bang', failureSeverity.warn, [ f1, f0 ])),
			createFailure('bang', failureSeverity.warn, [ f1, f0 ])
		);
	});
});

describe('or', () => {
	it('should process a Failure', () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');

		const resfn:processFailure<string, string> =
				value => createResult(`${ String(resolveFailureValue(value)) }bar`, [ f2, f3 ]);
		const failfn:processFailure<string, string> =
				value => createFailure(`${ String(resolveFailureValue(value)) }baz`, failureSeverity.fatal, [ f2, f3 ]);

		assert.deepStrictEqual(
			or(resfn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			or(failfn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			or(resfn, createFailure('foo', failureSeverity.warn, [ f0, f1 ])),
			createResult('foobar', [
				f2,
				f3,
				createFailure('foo', failureSeverity.warn, [ f0, f1 ])
			])
		);
		assert.deepStrictEqual(
			or(failfn, createFailure('foo', failureSeverity.warn, [ f0, f1 ])),
			createFailure('foobaz', failureSeverity.fatal, [
				f2,
				f3,
				createFailure('foo', failureSeverity.warn, [ f0, f1 ])
			])
		);
	});
});

describe('may', () => {
	it('should wrap a operation in a try/catch block', () => {
		assert.deepStrictEqual(
			may(() => createResult('foo'), undefined),
			createResult('foo')
		);
		assert.deepStrictEqual(
			may(value => createResult(`${ value }bar`), 'foo'),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			may(() => createFailure('foo', failureSeverity.warn), undefined),
			createFailure('foo', failureSeverity.warn)
		);
		assert.deepStrictEqual(
			may(value => createFailure(`${ value }bar`, failureSeverity.warn), 'foo'),
			createFailure('foobar', failureSeverity.warn)
		);
		assert.deepStrictEqual(
			may(() => { throw new Error('foo') }, undefined),
			createFailure(new Error('foo'))
		);
		assert.deepStrictEqual(
			may(value => { throw new Error(value) }, 'foo'),
			createFailure(new Error('foo'))
		);
	});
});

describe('resolve', () => {
	it('should resolve a Promise in a Maybe', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');

		assert.deepStrictEqual(
			await resolve(() => createResult(Promise.resolve('foo'), [ f0, f1 ]), undefined),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await resolve(() => createResult(Promise.reject(new Error('foo')), [ f0, f1 ]), undefined),
			createFailure(new Error('foo'), failureSeverity.error, [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await resolve(() => createFailure('foo', failureSeverity.warn, [ f0, f1 ]), undefined),
			createFailure('foo', failureSeverity.warn, [ f0, f1 ])
		);
	});
});
