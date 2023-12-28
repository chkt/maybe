import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import * as root from '../../source/flow';
import * as async from '../../source/flow/async';
import * as sync from '../../source/flow/sync';


describe('module', () =>{
	it('should expose public functions', () => {
		assert.strictEqual(root.and, sync.and);
		assert.strictEqual(root.or, sync.or);
		assert.strictEqual(root.onResult, sync.onResult);
		assert.strictEqual(root.onFailure, sync.onFailure);
		assert.strictEqual(root.andAsync, async.and);
		assert.strictEqual(root.orAsync, async.or);
		assert.strictEqual(root.onResultAsync, async.onResult);
		assert.strictEqual(root.onFailureAsync, async.onFailure);
	})
});
