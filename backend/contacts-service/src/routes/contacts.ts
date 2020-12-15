import { Router } from "express";
const router = Router();

import middlewareCommons from "ms-commons/api/routes/middlewares";
import contactsController from "../controllers/contacts";

//rotas

router.get(
  "/contacts",
  middlewareCommons.validateAuth,
  contactsController.getContacts
);

export default router;
