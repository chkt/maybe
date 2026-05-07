import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import * as async from '../../source/convert/async.js';
import * as root from '../../source/convert/index.js';
import * as sync from '../../source/convert/sync.js';


describe('module', () => {
	it('should expose public function', () => {
		assert.strictEqual(root.may, sync.may);
		assert.strictEqual(root.all, sync.all);
		assert.strictEqual(root.any, sync.any);
		assert.strictEqual(root.blank, sync.blank);
		assert.strictEqual(root.mayAsync, async.may);
		assert.strictEqual(root.resolve, async.resolve);
		assert.strictEqual(root.allAsync, async.all);
		assert.strictEqual(root.anyAsync, async.any);
	});
});
