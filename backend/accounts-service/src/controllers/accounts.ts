import { Token } from "ms-commons/api/auth/accountsAuth";
import controllerCommons from "ms-commons/api/controllers/controller";
import { Request, Response } from "express";
import { IAccount } from "./../models/account";
import repository from "../models/accountRepository";
import auth from "../auth";
import { AccountStatus } from "../models/accountsStatus";
import emailService, {
  AccountSettings,
} from "ms-commons/api/clients/emailService";
import accountRepository from "../models/accountRepository";
import { IAccountEmail } from "../models/accountEmail";
import accountEmailRepository from "../models/accountEmailRepository";

async function getAccounts(req: Request, res: Response, next: any) {
  const includeRemoved = req.query.includeRemoved == "true";

  const accounts: IAccount[] = await repository.findAll(includeRemoved);

  res.json(
    accounts.map((item) => {
      item.password = "";
      return item;
    })
  );
}

async function getAccountById(req: Request, res: Response, next: any) {
  try {
    const id = parseInt(req.params.id);
    if (!id) throw new Error("ID invalid format");

    const token = controllerCommons.getToken(res) as Token;
    if (id !== token.accountId) return res.sendStatus(403);

    const account = await repository.findById(id);

    if (account === null) {
      return res.sendStatus(404);
    } else {
      account.password = "";
      res.json(account);
    }
  } catch (error) {
    console.log(`getAccountById: ${error}`);
    res.status(400).end();
  }
}

async function addAccount(req: Request, res: Response, next: any) {
  try {
    const newAccount = req.body as IAccount;
    newAccount.password = auth.hashPassword(newAccount.password);
    const result = await repository.addAccount(newAccount);
    newAccount.password = "";
    newAccount.id = result.id;

    newAccount.settings = await emailService.createAccountSettings(
      newAccount.domain
    );

    res.status(201).json(newAccount);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function setAccount(req: Request, res: Response, next: any) {
  try {
    const accountParams = req.body as IAccount;
    if (accountParams.status === AccountStatus.REMOVED)
      return deleteAccount(req, res, next);

    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);

    if (accountParams.password)
      accountParams.password = auth.hashPassword(accountParams.password);

    const updatedAccount = await repository.set(accountId, accountParams);

    if (updatedAccount !== null) {
      updatedAccount.password = "";

      res.status(200).json(updatedAccount);
    } else res.status(404).end();
  } catch (error) {
    console.log(`setAccount: ${error}`);
    res.status(400).end();
  }
}

async function loginAccount(req: Request, res: Response, next: any) {
  try {
    const loginParams = req.body as IAccount;

    const account = await repository.findByEmail(loginParams.email);

    if (account !== null) {
      const isValid =
        auth.comparePassword(loginParams.password, account.password) &&
        account.status !== AccountStatus.REMOVED;

      if (isValid) {
        const token = await auth.sign(account.id!);
        return res.json({ auth: true, token });
      }

      res.sendStatus(401);
    }
  } catch (error) {
    console.log(`loginAccount: ${error}`);
    res.sendStatus(404);
  }
}

function logoutAccount(req: Request, res: Response, next: any) {
  res.json({ auth: false, token: null });
}

async function deleteAccount(req: Request, res: Response, next: any) {
  try {
    const accountId = parseInt(req.params.id);
    if (!accountId) return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;
    if (accountId !== token.accountId) return res.sendStatus(403);

    const account = await repository.findByIdWithEmails(accountId);

    if (account == null) return res.status(404).end();

    const accountEmails = account.get("accountEmails", {
      plain: true,
    }) as IAccountEmail[];

    if (accountEmails && accountEmails.length > 0) {
      const promises = accountEmails.map((item) => {
        return emailService.removeEmailIdentity(item.email);
      });

      await Promise.all(promises);

      await accountEmailRepository.removeAll(accountId);
    }

    await emailService.removeEmailIdentity(account.domain);

    if (req.query.force === "true") {
      await repository.remove(accountId);
      res.status(204).end();
    } else {
      const accountParams = {
        status: AccountStatus.REMOVED,
      } as IAccount;

      const updatedAccount = await repository.set(accountId, accountParams);
      if (updatedAccount != null) {
        updatedAccount.password = "";
        res.json(updatedAccount);
      } else {
        res.end();
      }
    }
  } catch (error) {
    console.log(`deleteAccount: ${error}`);
    res.sendStatus(400);
  }
}

async function getAccountSettings(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findByIdWithEmails(token.accountId);
    if (!account) return res.status(404).end();

    let emails: string[] = [];
    const accountEmails = account.get("accountEmails", {
      plain: true,
    }) as IAccountEmail[];

    if (accountEmails && accountEmails.length > 0) {
      emails = accountEmails.map((item) => item.email);
    }

    const settings = await emailService.getAccountSettings(
      account.domain,
      emails
    );
    res.json(settings);
  } catch (error) {
    console.log(`getAccountSettings: ${error}`);
    res.status(400).end();
  }
}

async function createAccountSettings(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findById(token.accountId);
    if (!account) return res.status(404).end();

    let accountSettings: AccountSettings;
    if (req.query.force === "true") {
      await emailService.removeEmailIdentity(account.domain);
    } else {
      accountSettings = await emailService.getAccountSettings(
        account.domain,
        []
      );
      if (accountSettings) return res.json(accountSettings);
    }
    accountSettings = await emailService.createAccountSettings(account.domain);
    res.status(201).json(accountSettings);
  } catch (error) {
    console.log(`createAccountSettings: ${error}`);
    res.status(400).end();
  }
}

async function addAccountEmail(req: Request, res: Response, next: any) {
  const accountEmail = req.body as IAccountEmail;
  const token = controllerCommons.getToken(res) as Token;
  try {
    const account = await accountRepository.findByIdWithEmails(token.accountId);
    if (!account) return res.status(404).end();

    if (!accountEmail.email.endsWith(`@${account.domain}`))
      return res.status(403).end();

    const accountEmails = account.get("accountEmails", {
      plain: true,
    }) as IAccountEmail[];

    let alreadyExists = false;

    if (accountEmails && accountEmails.length > 0) {
      alreadyExists = accountEmails.some(
        (item) => item.email === accountEmail.email
      );
    }

    if (alreadyExists) return res.status(400).end();

    accountEmail.accountId = token.accountId;
    const result = await accountEmailRepository.add(accountEmail);
    if (!result.id) return res.status(400).end();

    accountEmail.id = result.id!;
    const response = await emailService.addEmailIdentity(accountEmail.email);
    res.status(201).json(accountEmail);
  } catch (error) {
    console.log(`addAccountEmail: ${error}`);
    if (accountEmail.id)
      await accountEmailRepository.remove(accountEmail.id, token.accountId);
    res.status(400).end();
  }
}

async function getAccountEmails(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const account = await accountRepository.findByIdWithEmails(token.accountId);
    if (!account) return res.status(404).end();

    let emails: string[] = [];
    const accountEmails = account.get("accountEmails", {
      plain: true,
    }) as IAccountEmail[];
    if (accountEmails && accountEmails.length > 0) {
      emails = accountEmails.map((item) => item.email);
    }

    const settings = await emailService.getEmailSettings(emails);

    accountEmails.forEach((item) => {
      item.settings = settings.find((s) => s.email === item.email);
    });

    res.status(200).json(accountEmails);
  } catch (error) {
    console.log(`getAccountEmails: ${error}`);
    res.status(400).end();
  }
}

async function getAccountEmail(req: Request, res: Response, next: any) {
  try {
    let accountId = parseInt(req.params.accountId);

    if (!accountId) {
      const token = controllerCommons.getToken(res) as Token;
      accountId = token.accountId;
    }

    const accountEmailId = parseInt(req.params.accountEmailId);
    if (!accountId || !accountEmailId)
      return res.status(400).json({ message: "Both id are required" });

    const accountEmail = (await accountEmailRepository.findById(
      accountEmailId,
      accountId,
      true
    )) as IAccountEmail;

    if (!accountEmail) return res.status(404).end();
    const settings = await emailService.getEmailSettings([accountEmail.email]);
    if (!settings || settings.length === 0) return res.status(404).end();
    accountEmail.settings = settings[0];
    res.status(200).json(accountEmail);
  } catch (error) {
    console.log(`getAccountEmail: ${error}`);
    res.status(400).end();
  }
}

async function setAccountEmail(req: Request, res: Response, next: any) {
  try {
    const accountEmailId = parseInt(req.params.id);
    if (!accountEmailId)
      return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;

    const accountEmailParams = req.body as IAccountEmail;
    const updatedAccountEmail = await accountEmailRepository.set(
      accountEmailId,
      token.accountId,
      accountEmailParams
    );

    if (updatedAccountEmail !== null) {
      res.json(updatedAccountEmail);
    } else res.status(404).end();
  } catch (error) {
    console.log(`setAccountEmail: ${error}`);
    res.status(400).end();
  }
}

async function deleteAccountEmail(req: Request, res: Response, next: any) {
  try {
    const accountEmailId = parseInt(req.params.id);
    if (!accountEmailId)
      return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;

    const accountEmail = await accountEmailRepository.findById(
      accountEmailId,
      token.accountId
    );

    if (accountEmail == null) return res.status(404).end();

    await emailService.removeEmailIdentity(accountEmail.email);

    await accountEmailRepository.remove(accountEmailId, token.accountId);
    res.status(204).end();
  } catch (error) {
    console.log(`deleteAccountEmail: ${error}`);
    res.sendStatus(400);
  }
}

export default {
  getAccounts,
  addAccount,
  getAccountById,
  setAccount,
  loginAccount,
  logoutAccount,
  deleteAccount,
  getAccountSettings,
  createAccountSettings,
  addAccountEmail,
  getAccountEmails,
  getAccountEmail,
  setAccountEmail,
  deleteAccountEmail,
};
