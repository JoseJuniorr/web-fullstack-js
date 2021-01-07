import { Router } from "express";
const router = Router();

import middlewareCommons from "ms-commons/api/routes/middlewares";
import messagesController from "../controllers/messages";

//rotas

router.get(
  "/messages/:id",
  middlewareCommons.validateAuth,
  messagesController.getMessage
);

router.get(
  "/messages",
  middlewareCommons.validateAuth,
  messagesController.getMessages
);

export default router;
