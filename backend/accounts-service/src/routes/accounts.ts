import { Router } from "express";

import accountsController from "../controllers/accounts";

import {
  validateAccountSchema,
  validateAuthentication,
  validateLoginSchema,
  validateUpdateAccountSchema,
  validateAuthorization,
} from "./middlewares";

const router = Router();

router.get(
  "/accounts/settings",
  validateAuthentication,
  accountsController.getAccountSettings
);

router.get("/accounts", validateAuthentication, accountsController.getAccounts);

router.get(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  accountsController.getAccountById
);

router.patch(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  validateUpdateAccountSchema,
  accountsController.setAccount
);

router.post(
  "/accounts/settings",
  validateAuthentication,
  accountsController.createAccountSettings
);

router.post("/accounts/", validateAccountSchema, accountsController.addAccount);

router.post(
  "/accounts/login",
  validateLoginSchema,
  accountsController.loginAccount
);

router.post(
  "/accounts/logout",
  validateAuthentication,
  accountsController.logoutAccount
);

router.delete(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  accountsController.deleteAccount
);

export default router;
