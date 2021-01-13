import supertest from "supertest";
import { IAccount } from "../src/models/account";
import app from "./../src/app";

import repository from "../src/models/accountRepository";

import auth from "../src/auth";
import { AccountStatus } from "../src/models/accountsStatus";

const testEmail = "jest@accounts.test.com";
const testEmail2 = "jest2@accounts.test.com";
const hashPassword =
  "$2a$10$xPMrrzxd7w4doT5bQM7cMOVpZ3vTpo8Pag2qF8xO5m17tPVk1GQR6"; //123654
const testPassword = "123654";

let jwt: string = "";
let testId: number = 0;

let testAccountId = 0;

beforeAll(async () => {
  const testAccount: IAccount = {
    name: "jest",
    email: testEmail,
    password: hashPassword,
    domain: "jest.com",
  };

  const result = await repository.addAccount(testAccount);
  testId = result.id!;

  jwt = await auth.sign(testId);
});

afterAll(async () => {
  await repository.removeByEmail(testEmail);
  await repository.removeByEmail(testEmail2);
});

describe("testando rotas do accounts-service", () => {
  
  it("GET /accounts/ - Retorna statusCode 200", async () => {
    const resultado = await supertest(app)
      .get("/accounts/")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy;
  });

  it("GET /accounts/:id - Deve retornar statusCode 200", async () => {
    const resultado = await supertest(app)
      .get("/accounts/" + testId)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toBe(testId);
  });

  it("GET /accounts/:id - Deve retornar statusCode 403", async () => {
    const resultado = await supertest(app)
      .get("/accounts/-1")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(403);
  });

  it("GET /accounts/:id - Deve retornar statusCode 400", async () => {
    const resultado = await supertest(app)
      .get("/accounts/abc")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(400);
  });

  it("POST /accounts/ - Deve retornar status 201", async () => {
    const payload: IAccount = {
      name: "jest2",
      email: testEmail2,
      password: testPassword,
      domain: "jest.dev.br",
    };

    const resultado = await supertest(app).post("/accounts/").send(payload);

    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBeTruthy();
  });

  it("POST /accounts/ - Deve retornar statusCode 422", async () => {
    const payload = {
      street: "Av perimetral",
      cidade: "campo mourão",
    };

    const resultado = await supertest(app).post("/accounts/").send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("PATCH /accounts/:id - Deve retornar statusCode 200", async () => {
    const payload = {
      name: "Jose Junior",
    };

    const resultado = await supertest(app)
      .patch("/accounts/" + testId)
      .send(payload)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testId);
    expect(resultado.body.name).toEqual(payload.name);
  });

  it("PATCH /accounts/:id/ - Deve retornar statusCode 400", async () => {
    const payload = {
      name: "Jose Junior",
    };

    const resultado = await supertest(app)
      .patch("/accounts/abc")
      .send(payload)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(400);
  });

  it("PATCH /accounts/:id/ - Deve retornar statusCode 403", async () => {
    const payload = {
      name: "name test",
    };

    const resultado = await supertest(app)
      .patch("/accounts/-1")
      .send(payload)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(403);
  });

  it("DELETE /accounts/:id - Deve retornar statusCode 200", async () => {
    const resultado = await supertest(app)
      .delete("/accounts/" + testId)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.status).toEqual(AccountStatus.REMOVED);
  });

  it("DELETE /accounts/:id?force=true - Deve retornar statusCode 200", async () => {
    const resultado = await supertest(app)
      .delete(`/accounts/${testId}?force=true`)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
  });

  it("DELETE /accounts/:id - Deve retornar statusCode 403", async () => {
    const resultado = await supertest(app)
      .delete("/accounts/-1")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(403);
  });
});
