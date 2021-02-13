import request from "supertest";
import app from "../src/app";
import { IAccount } from "../src/models/account";
import accountRepository from "../src/models/accountRepository";
import auth from "../src/auth";
import emailService from "../../__commons__/src/api/clients/emailService";
import accountEmailRepository from "../src/models/accountEmailRepository";
import { IAccountEmail } from "../src/models/accountEmail";

let jwt: string;
let testAccountId: number;
const testDomain: string = "settings.com";
const testEmail: string = "jest@settings.com";
const hashPassword =
  "$2a$10$xPMrrzxd7w4doT5bQM7cMOVpZ3vTpo8Pag2qF8xO5m17tPVk1GQR6"; //123654

afterAll(async () => {
  jest.setTimeout(10000);

  await emailService.removeEmailIdentity(testDomain);
  await accountRepository.removeByEmail(testEmail);
});

describe("Testando as rotas do accounts/settings", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);

    const testAccount = {
      name: "jest",
      email: testEmail,
      domain: testDomain,
      password: hashPassword,
    };
    const result = await accountRepository.addAccount(testAccount);
    testAccountId = result.id!;

    jwt = auth.sign(testAccountId);

    await emailService.createAccountSettings(testDomain);
  });

  it("GET /accounts/settings - Deve retornar statusCode 200", async () => {
    const resultado = await request(app)
      .get("/accounts/settings")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body).toBeTruthy();
  });
});
