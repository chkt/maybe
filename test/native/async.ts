import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { createFailure, createResult } from '../../source/maybe';
import { failureFrom, maybeFrom, resultFrom } from '../../source/native/async';


describe('maybeFrom', () => {
	it('should maybeify a promise', async () => {
		const err = new Error('bang');

		assert.deepStrictEqual(
			await maybeFrom(async () => 'foo'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			await maybeFrom(async () => { throw err }),
			createFailure(err)
		);
		assert.deepStrictEqual(
			await maybeFrom(async () => Promise.reject(err)),
			createFailure(err)
		);
		assert.deepStrictEqual(
			await maybeFrom(async () => 'foo', v => typeof v === 'string'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			await maybeFrom(async () => 1, v => typeof v === 'string'),
			createFailure(1)
		);
		assert.deepStrictEqual(
			await maybeFrom(async v => `${ v }bar`, v => typeof v === 'string', 'foo'),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			await maybeFrom(async v => v + 1, v => typeof v === 'string', 1),
			createFailure(2)
		);
	});
});

describe('resultFrom', () => {
	it('should resultify a promise', async () => {
		const err = new Error('bang');

		assert.deepStrictEqual(
			await resultFrom(async () => 'foo'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			await resultFrom(async () => { throw err }),
			createFailure(err)
		);
		assert.deepStrictEqual(
			await resultFrom(async () => Promise.reject(err)),
			createFailure(err)
		);
	});
});

describe('failureFrom', () => {
	it('should failurify a promise', async () => {
		const err = new Error('bang');

		assert.deepStrictEqual(
			await failureFrom(async () => 'foo'),
			createFailure('foo')
		);
		assert.deepStrictEqual(
			await failureFrom(async () => { throw err }),
			createFailure(err)
		);
		assert.deepStrictEqual(
			await failureFrom(async () => Promise.reject(err)),
			createFailure(err)
		);
	});
});
