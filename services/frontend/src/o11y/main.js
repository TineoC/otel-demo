import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';

const exporter = new CollectorTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});


const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'store-frontend',
});

// set up the tracer provider with a simple span processor
const provider = new WebTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
  ],
  resource
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