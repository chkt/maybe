import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import { apply } from '../source/compose';


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
