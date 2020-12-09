import supertest from "supertest";
import app from ".././src/app";
import { IAccount } from "../src/models/account";

import repository from "../src/models/accountRepository";

const testEmail = "jest@gmail.com";
const hashPassword =
  "$2a$10$xPMrrzxd7w4doT5bQM7cMOVpZ3vTpo8Pag2qF8xO5m17tPVk1GQR6"; //123654
const testPassword = "123654";

beforeAll(async () => {
  const testAccount: IAccount = {
    name: "jest",
    email: testEmail,
    password: hashPassword,
    domain: "jest.com",
  };

  await repository.addAccount(testAccount);
});

afterAll(async () => {
  await repository.removeByEmail(testEmail);
});

describe("Testando rotas de autenticação", () => {
  it("POST /accounts/login - 200 OK", async () => {
    //testing
    const payload = {
      email: testEmail,
      password: testPassword,
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.auth).toBeTruthy();
    expect(resultado.body.token).toBeTruthy();
  });

  it("POST /accounts/login - 401 Unauthorized", async () => {
    const payload = {
      email: testEmail,
      password: testPassword + "1",
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(401);
  });

  it("POST /accounts/login - 422 Unprocessable Entity", async () => {
    const payload = {
      email: testEmail,
      password: ''
      
    };

    const resultado = await supertest(app)
      .post("/accounts/login")
      .send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("POST  /accounts/logout - 200 OK", async () => {
    const resultado = await supertest(app).post("/accounts/logout");

    expect(resultado.status).toEqual(200);
  });
});
