import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import * as root from '../../source/convert';
import * as sync from '../../source/convert/sync';
import * as async from '../../source/convert/async';


describe('module', () => {
	it('should expose public function', () => {
		assert.strictEqual(root.may, sync.may);
		assert.strictEqual(root.all, sync.all);
		assert.strictEqual(root.resolve, async.resolve);
		assert.strictEqual(root.allAsync, async.all);
	});
});
