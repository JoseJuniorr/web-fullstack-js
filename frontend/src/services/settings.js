import baseAPI from "./api";
import baseURLs from "../config/baseURLs";

class SettingsService {
  constructor() {
    this.api = baseAPI(baseURLs.API_ACCOUNTS);
  }

  //get : configurações do dominio

  async get() {
    const result = await this.api.get("/accounts/settings");

    return result.data;
  }

  //addAccountEmail: conta de email remetente
  async addAccountEmail(accountEmailModel) {
    const result = await this.api.put(
      "accounts/settings/accountEmails",
      accountEmailModel
    );
    return result.data;
  }

  //getOneAccountEmail:retornar uma conta de email

  async getOneAccountEmail(accountEmailId) {
    const result = await this.api.get(
      `accounts/settings/accountEmails/${accountEmailId}`
    );

    return result.data;
  }
  //getAllAccountEmail: retorna todas as contas de{ email
  async getAllAccountEmail() {
    const result = await this.api.get("accounts/settings/accountEmails");

    return result.data;
  }
}

export default SettingsService;
