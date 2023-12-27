import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { and, onFailure, onResult, or } from '../../source/flow/async';
import { Failure, Result, createFailure, createResult } from '../../source/maybe';
import { messageSeverity, resolveMessageValue } from '../../source/message';


describe('and', () => {
	it('should process a Promise<Result>', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');

		const resFn:(value:string) => Promise<Result<string>> =
			async value => Promise.resolve(createResult(
				`${ value }bar`,
				[ f2, f3 ]
			));
		const failFn:(value:string) => Promise<Failure<string>> =
			async value => Promise.resolve(createFailure(
				`${ value }baz`,
				messageSeverity.fatal,
				[ f2, f3 ]
			));

		assert.deepStrictEqual(
			await and(resFn, createResult('foo', [ f0, f1 ])),
			createResult('foobar', [ f0, f1, f2, f3 ])
		);
		assert.deepStrictEqual(
			await and(failFn, createResult('foo', [ f0, f1 ])),
			createFailure('foobaz', messageSeverity.fatal, [ f0, f1, f2, f3 ])
		);
		assert.deepStrictEqual(
			await and(resFn, createFailure('bang', messageSeverity.warn, [ f1, f0 ])),
			createFailure('bang', messageSeverity.warn, [ f1, f0 ])
		);
		assert.deepStrictEqual(
			await and(failFn, createFailure('bang', messageSeverity.warn, [ f1, f0 ])),
			createFailure('bang', messageSeverity.warn, [ f1, f0 ])
		);
	});
});

describe('or', () => {
	it('should process a Promise<Failure>', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2');
		const f3 = createFailure('f3');
		const f = createFailure('foo', messageSeverity.warn, [ f0, f1 ]);

		const resFn:(value:Failure<string>) => Promise<Result<string>> =
			async value => Promise.resolve(createResult(
				`${ String(resolveMessageValue(value)) }bar`,
				[ f2, f3 ]
			));
		const failFn:(value:Failure<string>) => Promise<Failure<string>> =
			async value => Promise.resolve(createFailure(
				`${ String(resolveMessageValue(value)) }baz`,
				messageSeverity.fatal,
				[ f2, f3 ]
			));

		assert.deepStrictEqual(
			await or(resFn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await or(failFn, createResult('foo', [ f0, f1 ])),
			createResult('foo', [ f0, f1 ])
		);
		assert.deepStrictEqual(
			await or(resFn, f),
			createResult('foobar', [ f, f2, f3 ])
		);
		assert.deepStrictEqual(
			await or(failFn, f),
			createFailure('foobaz', messageSeverity.fatal, [ f, f2, f3 ])
		);
	});
});

describe('onResult', () => {
	it('should call a function for failures', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f0, f1 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f4, f3 ]);

		assert.deepStrictEqual(await onResult(async () => Promise.resolve(r5), r2), {
			value : 'r2',
			messages : [ f0, f1, f4, f3 ]
		});

		assert.deepStrictEqual(await onResult(async () => Promise.resolve(f5), r2), {
			value : 'r2',
			messages : [ f0, f1, f5 ]
		});
		assert.deepStrictEqual(await onResult(async () => Promise.resolve(r5), f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0 ]
		});
		assert.deepStrictEqual(await onResult(async () => Promise.resolve(f5), f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0 ]
		});
	});
});

describe('onFailure', () => {
	it('should call a function for failures', async () => {
		const f0 = createFailure('f0');
		const f1 = createFailure('f1');
		const f2 = createFailure('f2', messageSeverity.warn, [ f1, f0 ]);
		const r2 = createResult('r2', [ f0, f1 ]);
		const f3 = createFailure('f3');
		const f4 = createFailure('f4');
		const f5 = createFailure('f5', messageSeverity.warn, [ f3, f4 ]);
		const r5 = createResult('r5', [ f4, f3 ]);

		assert.deepStrictEqual(await onFailure(async () => Promise.resolve(r5), r2), {
			value : 'r2',
			messages : [ f0, f1 ]
		});
		assert.deepStrictEqual(await onFailure(async () => Promise.resolve(f5), r2), {
			value : 'r2',
			messages : [ f0, f1 ]
		});
		assert.deepStrictEqual(await onFailure(async () => Promise.resolve(r5), f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f4, f3 ]
		});
		assert.deepStrictEqual(await onFailure(async () => Promise.resolve(f5), f2), {
			text : 'f2',
			severity : messageSeverity.warn,
			messages : [ f1, f0, f5 ]
		});
	});
});
