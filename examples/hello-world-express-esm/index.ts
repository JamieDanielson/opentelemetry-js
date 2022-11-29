import { NodeSDK } from "@opentelemetry/sdk-node";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  Span,
  trace,
  Tracer,
} from "@opentelemetry/api";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter({
  url: "https://api.honeycomb.io/v1/traces",
  headers: {
    "x-honeycomb-team": process.env.HONEYCOMB_API_KEY || "",
  },
});

const sdk: NodeSDK = new NodeSDK({
  traceExporter,
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

sdk
  .start()
  .then(() => {
    console.log("Tracing initialized");
  })
  .catch((error) => console.log("Error initializing tracing", error));

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
