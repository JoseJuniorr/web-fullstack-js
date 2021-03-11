import request from "supertest";
import app from "./../src/app";
import accountsApp from "../../accounts-service/src/app";
import contactsApp from "../../contacts-service/src/app";
import { IMessage } from "../src/models/message";
import repository from "../src/models/messageRepository";
import { MessageStatus } from "../src/models/messageStatus";
import { IAccountEmail } from "../../accounts-service/src/models/accountEmail";

const testDomain = "jest.send.com";
const testEmail = `jest@${testDomain}`;
const testPassword = "123456";
let jwt: string = "";
let testAccountId: number = 0;
let testMessageId: number = 0;
let testContactId: number = 0;
let testAccountEmailId: number = 0;

// import microservicesAuth from "../../__commons__/src/api/auth/microservicesAuth";

// // const token = microservicesAuth.sign({
// //   id: "bdb5353d-c079-4789-a60a-f208578f1182",
// //   contactId: 1,
// //   accountId: 2,
// //   messageId: 3,
// // });

// console.log(token);
beforeAll(async () => {
  jest.setTimeout(10000);

  const testAccount = {
    name: "jest",
    email: testEmail,
    password: testPassword,
    domain: "jest.send.com",
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
    accountEmailId: testAccountEmailId,
  } as IMessage;

  const addResult = await repository.add(testMessage, testAccountId);
  console.log(`addResult: ${addResult}`);
  testMessageId = addResult.id!;
  console.log(testMessageId);
});

afterAll(async () => {
  jest.setTimeout(10000);

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
  it("POST /messages/:id/send - Retorna statusCode 202", async () => {
    const resultado = await request(app)
      .post(`/messages/${testMessageId}/send`)
      .set("x-access-token", jwt);

    expect(resultado.status).toEqual(202);
    expect(resultado.body.id).toEqual(testMessageId);
    expect(resultado.body.status).toEqual(MessageStatus.SCHEDULED);
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
