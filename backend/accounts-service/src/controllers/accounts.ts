import { Request, Response } from "express";
import { IAccount } from "./../models/account";

const accounts: IAccount[] = [];

function getAccounts(req: Request, res: Response, next: any) {
  res.json(accounts);
}

function getAccountById(req: Request, res: Response, next: any) {
  try {
    const id = parseInt(req.params.id);
    if (!id) throw new Error("ID invalid format");

    const index = accounts.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).end();
    } else {
      res.json(accounts[index]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
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

export default { getAccounts, addAccount, getAccountById };
