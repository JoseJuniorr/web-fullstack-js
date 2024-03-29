import axios from "axios";
import microservicesAuth from "../auth/microservicesAuth";

export type IAccountEmail = {
  name: string;
  email: string;
};

export async function getAccountEmail(
  accountId: number,
  accountEmailId: number
) {
  try {
    const config = {
      headers: {
        "x-access-token": await microservicesAuth.sign({
          accountId,
          accountEmailId,
        }),
      },
    };
    const response = await axios.get(
      `${process.env.ACCOUNTS_API}/accounts/${accountId}/accountEmails/${accountEmailId}`,
      config
    );

    return response.data as IAccountEmail;
  } catch (error) {
    console.log(`accountsService.getAccountEmail: ${error}`);
    return null;
  }
}
