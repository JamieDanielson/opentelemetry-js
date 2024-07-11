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

// Use http from an ES module:
//    node --experimental-loader=@opentelemetry/instrumentation/hook.mjs use-http.mjs

import { createTestNodeSdk } from '@opentelemetry/contrib-test-utils';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const sdk = createTestNodeSdk({
  serviceName: 'use-http',
  instrumentations: [new HttpInstrumentation()],
});
sdk.start();

import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/route/test' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ hello: 'world' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

await new Promise(resolve => server.listen(0, resolve));
const port = server.address().port;

await new Promise(resolve => {
  http.get(`http://localhost:${port}/route/test`, res => {
    res.resume();
    res.on('end', () => {
      resolve();
    });
  });
});

await new Promise(resolve => server.close(resolve));
await sdk.shutdown();
