import { Router, Request, Response } from "express";
import Joi from "joi";

import accountsController from "../controllers/accounts";
import { accountSchema, loginSchema } from "../models/account";

function validateSchema(
  schema: Joi.ObjectSchema<any>,
  req: Request,
  res: Response,
  next: any
) {
  const { error } = schema.validate(req.body);

  if (error == null) return next();
  const { details } = error;
  const message = details.map((item) => item.message).join(",");

  console.log(message);
  res.status(422).end();
}

function validateAccount(req: Request, res: Response, next: any) {
  return validateSchema(accountSchema, req, res, next);
}
function validateLogin(req: Request, res: Response, next: any) {
  return validateSchema(loginSchema, req, res, next);
}

const router = Router();

router.get("/", accountsController.getAccounts);

router.get("/:id", accountsController.getAccountById);

router.post("/", validateAccount, accountsController.addAccount);

router.patch("/:id", validateAccount, accountsController.setAccount);

//Auth routes

router.post("/login", validateLogin, accountsController.loginAccount);

router.post("/logout", accountsController.logoutAccount);

export default router;
