import contactModel, { IContactModel } from "./contactModel";
import { IContact } from "./contact";

function findAll(accountId: number) {
  return contactModel.findAll<IContactModel>({ where: { accountId } });
}

export default { findAll };
