import { Router } from "express";

import accountsController from "../controllers/accounts";

import {
  validateAccountSchema,
  validateAuth,
  validateLoginSchema,
  validateUpdateAccountSchema,
} from "./middlewares";

const router = Router();

router.get("/", validateAuth, accountsController.getAccounts);

router.get("/:id", validateAuth, accountsController.getAccountById);

router.patch(
  "/:id",
  validateAuth,
  validateUpdateAccountSchema,
  accountsController.setAccount
);

router.post("/", validateAccountSchema, accountsController.addAccount);

//Auth routes

router.post("/login", validateLoginSchema, accountsController.loginAccount);

router.post("/logout", accountsController.logoutAccount);

export default router;
