import request from "supertest";
import app from "../src/app";
import accountsApp from "../../accounts-service/src/app";
import { IMessage } from "../src/models/message";
import repository from "../src/models/messageRepository";
import { MessageStatus } from "../src/models/messageStatus";
import { IAccountEmail } from "../../accounts-service/src/models/accountEmail";

const testDomain = "jest.test.com";
const testEmail = `jest@${testDomain}`;

const testPassword = "123456";

let jwt: string = "";
let testAccountId: number = 0;

let testMessageId: number = 0;
let testMessageId2: number = 0;

let testAccountEmailId: number = 0;

beforeAll(async () => {
  jest.setTimeout(10000);
  const testAccount = {
    name: "jest",
    email: testEmail,
    password: testPassword,
    domain: testDomain,
  };

  const account = await request(accountsApp)
    .post("/accounts/")
    .send(testAccount);

  testAccountId = account.body.id;

  const result = await request(accountsApp).post("/accounts/login").send({
    email: testEmail,
    password: testPassword,
  });

  jwt = result.body.token;

  const testAccountEmail: IAccountEmail = {
    name: "jest",
    email: testEmail,
    accountId: testAccountId,
  };

  const accountEmailResponse = await request(accountsApp)
    .put("/accounts/settings/accountEmails")
    .send(testAccountEmail)
    .set("x-access-token", jwt);

  console.log(`accountEmailResponse: ${accountEmailResponse.status}`);

  if (accountEmailResponse.status !== 201) throw new Error();
  testAccountEmailId = accountEmailResponse.body.id;

  //cadastro de message
  const testMessage = {
    accountId: testAccountId,
    body: "corpo da mensagem",
    subject: "assunto da mensagem",
    accountEmailId: testAccountEmailId,
  } as IMessage;

  const addResult = await repository.add(testMessage, testAccountId);
  console.log(`addResult: ${addResult}`);
  testMessageId = addResult.id!;
});

afterAll(async () => {
  jest.setTimeout(10000);

  const removeResult = await repository.removeById(
    testMessageId,
    testAccountId
  );
  const removeResult2 = await repository.removeById(
    testMessageId2 | 0,
    testAccountId
  );

  console.log(`RemoveResult: ${removeResult}: RemoveResult2: ${removeResult2}`);

  const deleteAccountEmailResponse = await request(accountsApp)
    .delete(
      `/accounts/settings/accountEmails/${testAccountEmailId}/?force=true`
    )
    .set("x-access-token", jwt);

  console.log(
    `deleteAccountEmailResponse: ${deleteAccountEmailResponse.status}`
  );

  const deleteResponse = await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
    .set("x-access-token", jwt);
  console.log(`deleteResponse: ${deleteResponse.status}`);

  const logoutResponse = await request(accountsApp)
    .post("/accounts/logout")
    .set("x-access-token", jwt);

  console.log(`logoutResponse: ${logoutResponse.status}`);
});

describe("testando rotas do messages", () => {
  it("GET /messages/ - Retorna statusCode 200", async () => {
    const resultado = await request(app)
      .get("/messages/")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(Array.isArray(resultado.body)).toBeTruthy();
  });

  it("GET /messages/ - Retorna statusCode 401", async () => {
    const resultado = await request(app).get("/messages/");

    expect(resultado.status).toEqual(401);
  });

  it("GET /messages/:id - Retorna statusCode 200", async () => {
    const resultado = await request(app)
      .get("/messages/" + testMessageId)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testMessageId);
  });

  it("GET /messages/:id - Retorna statusCode 401", async () => {
    const resultado = await request(app).get("/messages/" + testMessageId);

    expect(resultado.status).toEqual(401);
  });

  it("GET /messages/:id - Retorna statusCode 400", async () => {
    const resultado = await request(app)
      .get("/messages/abc")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(400);
  });

  it("GET /messages/:id - Retorna statusCode 404", async () => {
    const resultado = await request(app)
      .get("/messages/-1")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(404);
  });

  it("POST  /messages/ - Retorna statusCode 201", async () => {
    const payload = {
      accountId: testAccountId,
      subject: "outro subject",
      body: "outro body",
      accountEmailId: testAccountEmailId,
    } as IMessage;

    const resultado = await request(app)
      .post("/messages/")
      .set("x-access-token", jwt)
      .send(payload);

    testMessageId2 = parseInt(resultado.body.id);
    expect(resultado.status).toEqual(201);
    expect(resultado.body.id).toBeTruthy();
  });

  it("POST  /messages/ - Retorna statusCode 422", async () => {
    const payload = {
      street: "Av Perimetral",
    };

    const resultado = await request(app)
      .post("/messages/")
      .set("x-access-token", jwt)
      .send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("POST  /messages/ - Retorna statusCode 401", async () => {
    const payload = {
      accountId: testAccountId,
      subject: "outro subject",
      body: "outro body",
    } as IMessage;

    const resultado = await request(app)
      .post("/messages/")

      .send(payload);

    expect(resultado.status).toEqual(401);
  });

  it("PATCH /messages/:id - Retorna statusCode 200", async () => {
    const payload = {
      subject: "Subject alterado",
    };
    const resultado = await request(app)
      .patch("/messages/" + testMessageId)
      .set("x-access-token", jwt)
      .send(payload);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.subject).toEqual(payload.subject);
  });

  it("PATCH /messages/:id - Retorna statusCode 401-", async () => {
    const payload = {
      subject: "Subject alterado",
    };
    const resultado = await request(app)
      .patch("/messages/" + testMessageId)

      .send(payload);

    expect(resultado.status).toEqual(401);
  });

  it("PATCH /messages/:id - Retorna statusCode 422-", async () => {
    const payload = {
      street: "Av Perimetral",
    };
    const resultado = await request(app)
      .patch("/messages/" + testMessageId)
      .set("x-access-token", jwt)
      .send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("PATCH /messages/:id - Retorna statusCode 404", async () => {
    const payload = {
      subject: "José",
    };
    const resultado = await request(app)
      .patch("/messages/-1")
      .set("x-access-token", jwt)
      .send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("PATCH /messages/:id - Retorna statusCode 400", async () => {
    const payload = {
      subject: "José",
    };
    const resultado = await request(app)
      .patch("/messages/abc")
      .set("x-access-token", jwt)
      .send(payload);

    expect(resultado.status).toEqual(400);
  });

  it("DELETE /messages/:id - Deve retornar statusCode 200", async () => {
    const resultado = await request(app)
      .delete("/messages/" + testMessageId)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.status).toEqual(MessageStatus.REMOVED);
  });

  it("DELETE /messages/:id?force=true - Deve retornar statusCode 204", async () => {
    const resultado = await request(app)
      .delete(`/messages/${testMessageId}?force=true`)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(204);
  });

  it("DELETE /messages/:id - Deve retornar statusCode 403", async () => {
    const resultado = await request(app)
      .delete("/messages/-1")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(403);
  });
});
