import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { SEMRESATTRS_R } from '@opentelemetry/semantic-conventions';

// create the OTLP/Collector exporter
const collectorUrl = 'v1/traces'

const exporter = new CollectorTraceExporter({
  url: collectorUrl,
});


// set up the tracer provider with a simple span processor
const provider = new WebTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
  ],
  resource: {
    [SEMRESATTRS_R.SERVICE_NAME]: 'store-frontend',
  }
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