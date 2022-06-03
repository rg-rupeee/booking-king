const dotenv = require("dotenv");
const connectDB = require("./config/database");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  Sentry.captureException(err);
  process.exit(1);
});

// setting enviorment variables
dotenv.config({ path: "./config.env" });
const app = require("./app");

Sentry.init({
  dsn: "https://328fbeaa8eb64fc990bfe4d604cd1425@o1272677.ingest.sentry.io/6466582",
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  environment: process.env.NODE_ENV,
});

// database connection
connectDB();

// setting up server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening to Server on port ${port} *_*`);
});

// handling unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err);
  Sentry.captureException(err);
  server.close(() => {
    process.exit(1);
  });
});

// handling sigterm
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
