// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fa84b01f60f8b91e8dd1e31a5ab19c7b@o4510058158096384.ingest.de.sentry.io/4510273648459856",
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log",'warn','error']
    }),
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs:true
    }),
    Sentry.openAIIntegration({
      recordInputs: true,
      recordOutputs:true
    }),
  ],
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
