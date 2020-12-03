import { Router, Request, Response } from "express";

import accountsController from "../controllers/accounts";

const router = Router();

router.get("/", accountsController.getAccounts);

router.post("/", accountsController.addAccount);

export default router;
