import { Router } from "express";
const router = Router();

import middlewares from "./middlewares";

import middlewareCommons from "ms-commons/api/routes/middlewares";
import contactsController from "../controllers/contacts";

//rotas

router.get(
  "/contacts/:id",
  middlewareCommons.validateAuth,
  contactsController.getContact
);

router.get(
  "/contacts",
  middlewareCommons.validateAuth,
  contactsController.getContacts
);

router.post(
  "/contacts",
  middlewareCommons.validateAuth,
  middlewares.validateContactSchema,
  contactsController.addContact
);

router.patch(
  "/contacts/:id",
  middlewareCommons.validateAuth,
  middlewares.validateUpdateAccountSchema,
  contactsController.setContact
);

router.delete(
  "/contacts/:id",
  middlewareCommons.validateAuth,
  contactsController.deleteContact
);

export default router;
