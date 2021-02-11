import Sequelize, { Model, Optional } from "sequelize";
import database from "ms-commons/data/db";
import { IAccount } from "./account";
import AccountEmail from "./accountEmailModel";

interface AccountCreationAttributes extends Optional<IAccount, "id"> {}

export interface IAccountModel
  extends Model<IAccount, AccountCreationAttributes>,
    IAccount {}

const Account = database.define<IAccountModel>("account", {
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
    unique: true,
  },
});

Account.hasMany(AccountEmail, {
  constraints: true,
  foreignKey: "accountId",
});

export default Account;
