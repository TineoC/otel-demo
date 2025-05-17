import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

// create the OTLP/Collector exporter
// const collectorUrl = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT;
const collectorUrl = 'http://localhost:4317/v1/traces'; // Replace with your actual collector URL

const exporter = new CollectorTraceExporter({
  url: collectorUrl,
  serviceName: 'store-frontend',
});


// set up the tracer provider with a simple span processor
const provider = new WebTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});

// register context propagation and manager
provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator(),
});

// enable automatic instrumentation of browser APIs
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-xml-http-request': {
        clearTimingResources: true,
      },
    }),
  ],
});