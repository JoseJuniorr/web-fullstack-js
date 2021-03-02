import { Router } from "express";

import accountsController from "../controllers/accounts";

import {
  validateAccountSchema,
  validateAuthentication,
  validateLoginSchema,
  validateUpdateAccountSchema,
  validateAuthorization,
  validateAccountEmailSchema,
  validateAccountEmailUpdateSchema,
  validateMSAuthentication,
} from "./middlewares";

const router = Router();

/**
 * GET /accounts/settings
 * Return all settings from the account
 */
router.get(
  "/accounts/settings",
  validateAuthentication,
  accountsController.getAccountSettings
);

/**
 * GET /accounts/settings
 * Return all accountEmails from the account settings
 */
router.get(
  "/accounts/settings/accountEmails",
  validateAuthentication,
  accountsController.getAccountEmails
);

/**
 * GET /accounts/settings/accountEmails/:accountEmailId
 * Return one accountEmail from the account settings
 */

router.get(
  "/accounts/settings/accountEmails/:accountEmailId",
  validateAuthentication,
  accountsController.getAccountEmail
);

/**
 * GET /accounts/:accountId/accountEmails/:accountEmailId
 * MicroService call to get an account email from an account
 */
router.get(
  "/accounts/:accountId/accountEmails/:accountEmailId",
  validateMSAuthentication,
  accountsController.getAccountEmail
);

/**
 * GET /accounts
 * Return all accounts
 */
router.get("/accounts", validateAuthentication, accountsController.getAccounts);

/**
 * GET /accounts/:id
 * Return one account
 */
router.get(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  accountsController.getAccountById
);

/**
 * PATCH /accounts/:id
 * Update the account
 */
router.patch(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  validateUpdateAccountSchema,
  accountsController.setAccount
);

/**
 * PATCH /accounts/settings/accountEmails/:id
 * Update an accountEmail from the account
 */
router.patch(
  "/accounts/settings/accountEmails/:id",
  validateAuthentication,
  validateAccountEmailUpdateSchema,
  accountsController.setAccountEmail
);

/**
 *PUT /accounts/settings/accountEmails
 *Add one accountEmail from the account settings
 *
 */

router.put(
  "/accounts/settings/accountEmails",
  validateAuthentication,
  validateAccountEmailSchema,
  accountsController.addAccountEmail
);
/**
 * POST /accounts/settings
 * Create the account settings
 * ?force=true to be sure that will be recreated
 */

router.post(
  "/accounts/settings",
  validateAuthentication,
  accountsController.createAccountSettings
);

/**
 * POST /accounts
 * Open route to create a new account
 */
router.post("/accounts/", validateAccountSchema, accountsController.addAccount);

/**
 * POST /accounts/login
 * Login account
 */
router.post(
  "/accounts/login",
  validateLoginSchema,
  accountsController.loginAccount
);

/**
 * POST /accounts/logout
 * Logout
 */
router.post(
  "/accounts/logout",
  validateAuthentication,
  accountsController.logoutAccount
);

/**
 * DELETE /accounts/:id
 * Remove the account - soft delete the account
 * ?force=true to really remove
 */
router.delete(
  "/accounts/:id",
  validateAuthentication,
  validateAuthorization,
  accountsController.deleteAccount
);

/**
 * DELETE /accounts/settings/accountEmails/:id
 * Remove the accountEmail from the account settings
 */
router.delete(
  "/accounts/settings/accountEmails/:id",
  validateAuthentication,
  accountsController.deleteAccountEmail
);

export default router;
