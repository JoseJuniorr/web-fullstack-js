import { Router } from "express";
const router = Router();

import middlewareCommons from "ms-commons/api/routes/middlewares";
import messagesController from "../controllers/messages";

import {
  validateMessageSchema,
  validateUpdateMessageSchema,
} from "./middlewares";

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

router.post(
  "/messages",
  middlewareCommons.validateAuth,
  validateMessageSchema,
  messagesController.addMessage
);

router.patch(
  "/messages/:id",
  middlewareCommons.validateAuth,
  validateUpdateMessageSchema,
  messagesController.setMessage
);

router.delete(
  "/messages/:id",
  middlewareCommons.validateAuth,
  messagesController.deleteMessage
);

export default router;
