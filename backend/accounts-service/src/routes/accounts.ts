import { Router } from "express";

import accountsController from "../controllers/accounts";

import {
  validateAccount,
  validateLogin,
  validateUpdateAccount,
  validateAuth
} from "./middlewares";

const router = Router();

router.get("/", validateAuth, accountsController.getAccounts);

router.get("/:id", validateAuth, accountsController.getAccountById);

router.patch("/:id", validateAuth, validateUpdateAccount, accountsController.setAccount);

router.post("/",  validateAccount, accountsController.addAccount);



//Auth routes

router.post("/login", validateLogin, accountsController.loginAccount);

router.post("/logout", validateAuth, accountsController.logoutAccount);

export default router;
