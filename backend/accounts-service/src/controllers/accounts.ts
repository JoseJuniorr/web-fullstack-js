import { Request, Response } from "express";
import { IAccount } from "./../models/account";

const accounts: IAccount[] = [];

function getAccounts(req: Request, res: Response, next: any) {
  res.json(accounts);
}

function addAccount(req: Request, res: Response, next: any) {
  try {
    const newAccount = req.body as IAccount;
    accounts.push(newAccount);
    res.status(201).json(newAccount);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}

export default { getAccounts, addAccount };
