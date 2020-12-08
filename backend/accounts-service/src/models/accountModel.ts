import Sequelize, { Model, Optional } from "sequelize";
import database from "../db";

import { IAccount } from "./account";

interface AccountCreationAttributes extends Optional<IAccount, "id"> {}

export interface AccountModel
  extends Model<IAccount, AccountCreationAttributes>,
    IAccount {}

export default database.define<AccountModel>("account", {
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
