import axios from "axios";

import microservicesAuth from "../auth/microservicesAuth";

export interface IContact {
  id: number;
}

export async function getContacts(jwt: string) {
  try {
    const config = {
      headers: {
        "x-access-token": jwt,
      },
    };

    const response = await axios.get(
      `${process.env.CONTACTS_API}/contacts`,
      config
    );
    if (response.status !== 200) return null;
    return response.data as Array<IContact>;
  } catch (error) {
    console.log(`contactsService.getContacts: ${error}`);
    return null;
  }
}

export async function getContact(contactId: number, accountId: number) {
  try {
    const config = {
      headers: {
        "x-access-token": microservicesAuth.sign({ accountId, contactId }),
      },
    };

    const response = await axios.get(
      `${process.env.CONTACTS_API}/contacts/${contactId}/account/${accountId}`,
      config
    );
    if (response.status !== 200) return null;
    return response.data as IContact;
  } catch (error) {
    console.log(`contactsService.getContact: ${error}`);
    return null;
  }
}

export default { getContacts, getContact };
