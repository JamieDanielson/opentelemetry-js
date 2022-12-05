// import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import {
  InstrumentationBase,
  registerInstrumentations,
} from "@opentelemetry/instrumentation";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  Span,
  trace,
  Tracer,
} from "@opentelemetry/api";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const tracerProvider = new NodeTracerProvider();

tracerProvider.register();

class TestAutoInstrumentation extends InstrumentationBase {
  constructor() {
    super("test-autoinstrumentions", "0.0.1");
  }
  init() {
    console.log("hello!");
  }
  enable() {}
  disable() {}
}

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    // new ExpressInstrumentation(),
    new TestAutoInstrumentation(),
  ],
});

import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();
const hostname = "0.0.0.0";
const port = 3000;

app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    const tracer: Tracer = trace.getTracer("hello-world-tracer");
    tracer.startActiveSpan("hello", (span: Span) => {
      console.log("saying hello to the world!");
      span.end();
    });
    res.end("Hello, World!\n");
  } catch (err) {
    next(err);
  }
});

app.listen(port, hostname, () => {
  console.log(`Now listening on: http://${hostname}:${port}/`);
});
