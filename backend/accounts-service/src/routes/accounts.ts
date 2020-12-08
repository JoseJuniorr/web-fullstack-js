import { Router } from "express";

import accountsController from "../controllers/accounts";

import {
  validateAccount,
  validateLogin,
  validateUpdateAccount,
} from "./middlewares";

const router = Router();

router.get("/", accountsController.getAccounts);

router.get("/:id", accountsController.getAccountById);

router.post("/", validateAccount, accountsController.addAccount);

router.patch("/:id", validateUpdateAccount, accountsController.setAccount);

//Auth routes

router.post("/login", validateLogin, accountsController.loginAccount);

router.post("/logout", accountsController.logoutAccount);

export default router;
