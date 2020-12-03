import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";

import accountsRouter from "./routes/accounts";

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use("/accounts", accountsRouter);

const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log("server running on port: " + port);
});
