import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { createFailure, createResult } from '../../source/maybe';
import { failureFrom, maybeFrom, resultFrom } from '../../source/native/sync';


/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('maybeFrom', () => {
	it('should maybeify a return value', () => {
		const err = new Error('bang');

		assert.deepStrictEqual(
			maybeFrom(() => 'foo'),
			createResult('foo')
		);
		assert.throws(() => maybeFrom(() => {
			throw err;
		}));
		assert.deepStrictEqual(
			maybeFrom(() => 'foo', v => typeof v === 'string'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			maybeFrom(() => 1, v => typeof v === 'string'),
			createFailure(1)
		);
		assert.deepStrictEqual(
			maybeFrom(value => `${ value }bar`, v => typeof v === 'string', 'foo'),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			maybeFrom(value => value + 2, v => typeof v === 'string', 1),
			createFailure(3)
		);
	});
});

describe('resultFrom', () => {
	it('should resultify a return value', () => {
		assert.deepStrictEqual(
			resultFrom(() => 'foo'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			resultFrom(value => `${ value }bar`, 'foo'),
			createResult('foobar')
		);
	});
});

describe('failureFrom', () => {
	it('should failurify a return value', () => {
		assert.deepStrictEqual(
			failureFrom(() => 'foo'),
			createFailure('foo')
		);
		assert.deepStrictEqual(
			failureFrom(value => `${ value }bar`, 'foo'),
			createFailure('foobar')
		);
	});
});
