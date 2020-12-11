import { Router } from "express";

import accountsController from "../controllers/accounts";



import {
  validateAccountSchema,
  validateAuth,
  validateLoginSchema,
  validateUpdateAccountSchema,
} from "./middlewares";

const router = Router();

router.get("/accounts", validateAuth, accountsController.getAccounts);

router.get("/accounts/:id", validateAuth, accountsController.getAccountById);

router.patch(
  "/:id",
  validateAuth,
  validateUpdateAccountSchema,
  accountsController.setAccount
);

router.post("/accounts/", validateAccountSchema, accountsController.addAccount);

//Auth routes

router.post("/accounts/login", validateLoginSchema, accountsController.loginAccount);

router.post("/accounts/logout", accountsController.logoutAccount);

export default router;
