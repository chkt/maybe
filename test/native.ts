import * as assert from 'assert';
import { describe, it } from 'mocha';
import { createFailure } from '../source/failure';
import { createResult } from '../source/maybe';
import { filter, result } from '../source/native';


describe('filter', () => {
	it('should maybeify a return value', () => {
		assert.deepStrictEqual(
			filter(() => 'foo', v => typeof v === 'string'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			filter(() => 1, v => typeof v === 'string'),
			createFailure(1)
		);
		assert.deepStrictEqual(
			filter(value => `${ value }bar`, v => typeof v === 'string', 'foo'),
			createResult('foobar')
		);
		assert.deepStrictEqual(
			filter(value => value + 2, v => typeof v === 'string', 1),
			createFailure(3)
		);
	});
});

describe('result', () => {
	it('should resultify a return value', () => {
		assert.deepStrictEqual(
			result(() => 'foo'),
			createResult('foo')
		);
		assert.deepStrictEqual(
			result(value => `${ value }bar`, 'foo'),
			createResult('foobar')
		);
	});
});
