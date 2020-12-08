import Sequelize, { Model, Optional } from "sequelize";
import database from "../db";

import { IAccount } from "./account";

interface AccountCreationAttributes extends Optional<IAccount, "id"> {}

export interface AccountModel
  extends Model<IAccount, AccountCreationAttributes>,
    IAccount {}

const accountModel = database.define<AccountModel>("account", {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.SMALLINT.UNSIGNED,
    defaultValue: 100,
    allowNull: false,
  },
  domain: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

function findAll() {
  return accountModel.findAll<AccountModel>();
}

function findById(id: number) {
  return accountModel.findByPk<AccountModel>(id);
}

function addAccount(account: IAccount) {
  return accountModel.create(account);
}

async function set(id: number, account: IAccount) {
  const originalAccount = await accountModel.findByPk<AccountModel>(id);

  if (originalAccount !== null) {
    originalAccount.name = account.name;
    originalAccount.domain = account.domain;
    originalAccount.status = account.status;
    if (!account.password) originalAccount.password = account.password;

    return await originalAccount.save();
    return originalAccount;
  }
  throw new Error(`Account not found.`);
}

export default { findAll, findById, addAccount, set };
