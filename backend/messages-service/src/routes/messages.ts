import { Router } from "express";

const router = Router();

import middlewareCommons from "ms-commons/api/routes/middlewares";
import messagesController from "../controllers/messages";

import {
  validateMessageSchema,
  validateUpdateMessageSchema,
  validateSendingSchema,
} from "./middlewares";

/*
 *GET /messages/:id
 *Returns one message from this account
 */
router.get(
  "/messages/:id",
  middlewareCommons.validateAccountAuth,
  messagesController.getMessage
);

/*
 *GET /messages/:id
 *Returns all message from this account
 */
router.get(
  "/messages",
  middlewareCommons.validateAccountAuth,
  messagesController.getMessages
);

/*
 *POST /messages
 *Add one message from this account
 */
router.post(
  "/messages",
  middlewareCommons.validateAccountAuth,
  validateMessageSchema,
  messagesController.addMessage
);
/*
 *PATCH /messages/:id
 *Updates one message from this account
 */
router.patch(
  "/messages/:id",
  middlewareCommons.validateAccountAuth,
  validateUpdateMessageSchema,
  messagesController.setMessage
);

/*
 *DELETE /messages/:id
 *Remove one message from this account
 */
router.delete(
  "/messages/:id",
  middlewareCommons.validateAccountAuth,
  messagesController.deleteMessage
);

/*
 *POST /messages/:id/send
 *Frontend calls this route to send a message to a bunch of contacts
 *In fact, the message will be queued
 */
router.post(
  "/messages/:id/send",
  middlewareCommons.validateAccountAuth,
  messagesController.scheduleMessage
);

/**
 * POST /messages/send
 * AWS Lambda calls this route to send a message from the queue to one contacts
 * The backend wil send the email
 */

router.post(
  "/messages/sending",
  middlewareCommons.validateMicroserviceAuth,
  validateSendingSchema,
  messagesController.sendMessage
);

export default router;
