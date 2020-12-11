import express, { Router } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

export default (router: Router) => {
  const app = express();

  app.use(helmet());
  app.use(bodyParser.json());

  app.use(router);

  return app;
};
