import {
  // ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { CompositePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { resourceFromAttributes } from '@opentelemetry/resources';

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'store-frontend',
});

// set up the tracer provider with a simple span processor
const provider = new WebTracerProvider({
  resource,
  spanProcessors: [
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new SimpleSpanProcessor(new OTLPTraceExporter({
      url: window.location.origin + '/v1/traces',
    })),
  ],
});

// register context propagation and manager
provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new CompositePropagator({
    propagators: [
      new B3Propagator(),
      new W3CTraceContextPropagator(),
    ],
  }),
});

// Registering instrumentations
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    getWebAutoInstrumentations({
      // load custom configuration for xml-http-request instrumentation
      '@opentelemetry/instrumentation-xml-http-request': {
        clearTimingResources: true,
      },
      '@opentelemetry/instrumentation-fetch': {
        clearTimingResources: true,
      },
      '@opentelemetry/instrumentation-user-interaction': {
        eventNames: ['click', 'submit'],
      },
    }),
  ],
});