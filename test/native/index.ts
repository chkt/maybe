import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import * as root from '../../source/native';
import * as async from '../../source/native/async';
import * as common from '../../source/native/common';
import * as sync from '../../source/native/sync';


describe('module', () => {
	it('should expose public functions', () => {
		assert.strictEqual(root.filterAll, common.filterAll);
		assert.strictEqual(root.maybeFrom, sync.maybeFrom);
		assert.strictEqual(root.resultFrom, sync.resultFrom);
		assert.strictEqual(root.failureFrom, sync.failureFrom);
		assert.strictEqual(root.maybeAsync, async.maybeFrom);
		assert.strictEqual(root.resultAsync, async.resultFrom);
		assert.strictEqual(root.failureAsync, async.failureFrom);
	});
});
