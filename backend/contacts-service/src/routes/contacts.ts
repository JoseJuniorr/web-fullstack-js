import { Router } from "express";
const router = Router();

import middlewares from "./middlewares";

import middlewareCommons from "ms-commons/api/routes/middlewares";
import contactsController from "../controllers/contacts";

/**
 * GET /contacts/:id/account/:accountId
 * Only Microservicesd call this route
 * Returns one contact from the account
 */

router.get(
  "/contacts/:id/account/:accountId",
  middlewareCommons.validateMicroserviceAuth,
  contactsController.getContact
);

/**
 * GET /contacts/:id
 * Returns one contact from the account
 */
router.get(
  "/contacts/:id",
  middlewareCommons.validateAccountAuth,
  contactsController.getContact
);
/**
 * GET /contacts/
 * Returns all contacts from the account
 */
router.get(
  "/contacts",
  middlewareCommons.validateAccountAuth,
  contactsController.getContacts
);

/**
 * POST /contacts
 * Save a contact to an account
 */
router.post(
  "/contacts",
  middlewareCommons.validateAccountAuth,
  middlewares.validateContactSchema,
  contactsController.addContact
);

/**
 * PATCH /contacts/:id
 * Updates a contact from the account
 */
router.patch(
  "/contacts/:id",
  middlewareCommons.validateAccountAuth,
  middlewares.validateUpdateAccountSchema,
  contactsController.setContact
);
/**
 * DELETE /contacts/:id
 * Remove one contact from the account
 */
router.delete(
  "/contacts/:id",
  middlewareCommons.validateAccountAuth,
  contactsController.deleteContact
);

export default router;
