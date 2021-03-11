import express, { Router } from "express";

import helmet from "helmet";
import cors from "cors";
import logger from "morgan";

function getCorsOrigin() {
  const origin = "*";

  if (!origin) throw new Error("CORS_ORIGIN is a required env var");

  if (origin === "*") return origin;

  return new RegExp(origin);
}

export default (router: Router) => {
  const app = express();

  const loggerOpts = logger("dev");
  app.use(loggerOpts);

  app.use(helmet());
  const corstOpts = cors({
    origin: getCorsOrigin(),
    optionsSuccessStatus: 200,
  });
  app.use(corstOpts);

  app.use(express.json());

  app.use(router);

  app.get("/health", (req, res) => {
    res.json({ message: `${process.env.MS_NAME} is up and running!` });
  });

  return app;
};
