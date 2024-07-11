/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as assert from 'assert';
import {
  runTestFixture,
  TestCollector,
} from '@opentelemetry/contrib-test-utils';

// this aint working bc it keeps passing.
describe('ESM', () => {
  it('should work with ESM', async () => {
    await runTestFixture({
      cwd: __dirname,
      argv: ['../fixtures/use-http.mjs'],
      env: {
        NODE_OPTIONS:
          '--experimental-loader=@opentelemetry/instrumentation/hook.mjs',
        NODE_NO_WARNINGS: '1',
      },
      checkResult: (err, stdout, stderr) => {
        assert.ifError(err);
      },
      checkCollector: (collector: TestCollector) => {
        const spans = collector.sortedSpans;

        // eslint-disable-next-line no-console
        console.log('spans.length', spans.length); // 1
        assert.strictEqual(spans.length, 5); // why is this passing?
        assert.strictEqual(spans[0].name, 'heygirl GET /route/{param}'); // why is this passing?
        assert.strictEqual(
          spans[0].instrumentationScope.name,
          '@opentelemetry/instrumentation-http'
        );
        assert.strictEqual(spans[1].name, 'route - /route/{param}');
        assert.strictEqual(1, 2); // lol wateven
        assert.notStrictEqual(1, 1);
      },
    });
  });
});
