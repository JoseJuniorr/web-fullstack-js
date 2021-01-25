import request from "supertest";
import app from "./../src/app";
import accountsApp from "../../accounts-service/src/app";
import contactsApp from "../../contacts-service/src/app";
import { IMessage } from "../src/models/message";
import repository from "../src/models/messageRepository";
import { MessageStatus } from "../src/models/messageStatus";

const testEmail = "jest@messages.com";
const testPassword = "123456";
let jwt: string = "";
let testAccountId: number = 0;
let testMessageId: number = 0;
let testContactId: number = 0;

beforeAll(async () => {
  const testAccount = {
    name: "jest",
    email: testEmail,
    password: testPassword,
    domain: "jest.com",
  };

  const account = await request(accountsApp)
    .post("/accounts/")
    .send(testAccount);

  testAccountId = account.body.id;

  const loginResponse = await request(accountsApp)
    .post("/accounts/login")
    .send({
      email: testEmail,
      password: testPassword,
    });

  console.log(`loginResponse: ${loginResponse.status}`);
  jwt = loginResponse.body.token;

  const testContact = {
    accountId: testAccountId,
    name: "test contact",
    email: testEmail,
  };

  const contactResponse = await request(contactsApp)
    .post("/contacts")
    .send(testContact)
    .set("x-access-token", jwt);

  console.log(`contactResponse: ${contactResponse.status}`);
  testContactId = contactResponse.body.id;

  //cadastro de message
  const testMessage = {
    accountId: testAccountId,
    subject: "assunto da mensagem",
    body: "corpo da mensagem",
  } as IMessage;

  const addResult = await repository.add(testMessage, testAccountId);
  console.log(`addResult: ${addResult}`);
  testMessageId = addResult.id!;
  console.log(testMessageId);
});

afterAll(async () => {
  const removeResult = await repository.removeById(
    testMessageId,
    testAccountId
  );

  console.log(`RemoveResult: ${removeResult}`);

  const deleteContactResponse = await request(contactsApp)
    .delete(`/contacts/${testContactId}?force=true`)
    .set("x-access-token", jwt);

  console.log(`deleteContactResponse: ${deleteContactResponse.status}`);

  const deleteAccountResponse = await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
    .set("x-access-token", jwt);
  console.log(`deleteResponse: ${deleteAccountResponse.status}`);

  const logoutResponse = await request(accountsApp)
    .post("/accounts/logout")
    .set("x-access-token", jwt);

  console.log(`logoutResponse: ${logoutResponse.status}`);
});

describe("testando rotas do messages", () => {
  it("POST /messages/:id/send - Retorna statusCode 200", async () => {
    const resultado = await request(app)
      .post(`/messages/${testMessageId}/send`)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(200);
    expect(resultado.body.id).toEqual(testMessageId);
    expect(resultado.body.status).toEqual(MessageStatus.SENT);
  });

  it("POST /messages/:id/send - Retorna statusCode 401", async () => {
    const resultado = await request(app).post(
      `/messages/${testMessageId}/send`
    );

    expect(resultado.status).toEqual(401);
  });

  it("POST /messages/:id/send - Retorna statusCode 403", async () => {
    const resultado = await request(app)
      .post("/messages/-1/send")
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(403);
  });

  it("POST /messages/:id/send - Retorna statusCode 400", async () => {
    const resultado = await request(app)
      .post(`/messages/abc/send`)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(400);
  });
});
