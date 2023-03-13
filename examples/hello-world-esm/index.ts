import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  registerInstrumentations,
} from '@opentelemetry/instrumentation';
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  Span,
  trace,
  Tracer,
} from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import http from 'http';

// have to import and use http for iitm to pick
// up for monkey patching
console.log(http)

const serviceName = 'hello-esm';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  }),
});
const consoleExporter = new ConsoleSpanExporter();
const otlpExporter = new OTLPTraceExporter({
  url: 'https://api.honeycomb.io/v1/traces',
  headers: {
    'x-honeycomb-team': process.env.HONEYCOMB_API_KEY || '',
  },
});
const simpleProcessor = new SimpleSpanProcessor(consoleExporter);
const batchProcessor = new BatchSpanProcessor(otlpExporter);
tracerProvider.addSpanProcessor(simpleProcessor);
tracerProvider.addSpanProcessor(batchProcessor);
tracerProvider.register();

class TestInstrumentation extends InstrumentationBase {
  constructor() {
    super('@hny/test-instrumentation', '0.0.1');
  }
  init() {
    console.log('@hny/test-instrumentation initialized!');
    return new InstrumentationNodeModuleDefinition('test', ['*']);
  }
}

registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new TestInstrumentation()],
});

import express, { Express, NextFunction, Request, Response } from 'express';
const app: Express = express();
const hostname = '0.0.0.0';
const port = 5678;

app.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const autoinstr = trace?.getActiveSpan();
    autoinstr?.setAttribute('instr.source', 'auto-instrumented');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const tracer: Tracer = trace.getTracer('manual-tracer');
    tracer.startActiveSpan('manual', (span: Span) => {
      console.log(`this is created from trace.getTracer("manual-tracer")!`);
      span.setAttribute('instr.source', 'manually-instrumented');
      span.end();
    });
    res.end('Hello, World!\n');
  } catch (err) {
    next(err);
  }
});

app.listen(port, hostname, () => {
  console.log(`Now listening on: http://${hostname}:${port}/`);
});
