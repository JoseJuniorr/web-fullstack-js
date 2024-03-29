import request from "supertest";
import app from "./../src/app";
import accountsApp from "../../accounts-service/src/app";
import contactsApp from "../../contacts-service/src/app";
import { IMessage } from "../src/models/message";
import repository from "../src/models/messageRepository";
import { MessageStatus } from "../src/models/messageStatus";
import { IAccountEmail } from "../../accounts-service/src/models/accountEmail";
import { ISending } from "../src/models/sending";
import { SendingStatus } from "../src/models/sendingStatus";
import { v4 as uuid } from "uuid";
import sendingRepository from "../src/models/sendingRepository";
import microservicesAuth from "../../__commons__/src/api/auth/microservicesAuth";

const testDomain = "jest.send.com";
const testEmail = `jest@${testDomain}`;
const testEmail2 = `jest2@${testDomain}`;
const testPassword = "123456";
let jwt: string = "";
let testAccountId: number = 0;
let testMessageId: number = 0;
let testContactId: number = 0;
let testContactId2: number = 0;
let testAccountEmailId: number = 0;

let testSendingId: string = "";
let testSendingId2: string = "";

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
    domain: testDomain,
  };

  const accountResponse = await request(accountsApp)
    .post("/accounts/")
    .send(testAccount);
  console.log(`accountResponse: ${accountResponse.status}`);
  testAccountId = accountResponse.body.id;
  console.log(`testAccountId: ${testAccountId}`);

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

  //test contact
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

  //test contact 2
  const testContact2 = {
    accountId: testAccountId,
    name: "test contact 2",
    email: testEmail2,
  };

  const contactResponse2 = await request(contactsApp)
    .post("/contacts")
    .send(testContact2)
    .set("x-access-token", jwt);

  console.log(`contactResponse2: ${contactResponse2.status}`);
  testContactId2 = contactResponse2.body.id;

  //cadastro de message
  const testMessage = {
    accountId: testAccountId,
    subject: "assunto da mensagem",
    body: "corpo da mensagem",
    accountEmailId: testAccountEmailId,
  } as IMessage;

  const addResult = await repository.add(testMessage, testAccountId);
  console.log(`addResult: ${addResult.id}`);
  testMessageId = addResult.id!;
  console.log(testMessageId);

  const testSending: ISending = {
    accountId: testAccountId,
    messageId: testMessageId,
    contactId: testContactId,
    status: SendingStatus.QUEUED,
    id: uuid(),
  };

  const sendingResult = await sendingRepository.add(testSending);
  console.log(`sendingResult: ${sendingResult.id}`);

  if (!sendingResult.id) throw new Error();
  testSendingId = sendingResult.id;

  const testSending2: ISending = {
    accountId: testAccountId,
    messageId: testMessageId,
    contactId: testContactId2,
    status: SendingStatus.QUEUED,
    id: uuid(),
  };

  const sendingResult2 = await sendingRepository.add(testSending2);
  console.log(`sendingResult2: ${sendingResult2.id}`);

  if (!sendingResult2.id) throw new Error();
  testSendingId2 = sendingResult2.id;
});

afterAll(async () => {
  jest.setTimeout(10000);

  const sendingResult = await sendingRepository.removeById(
    testSendingId,
    testAccountId
  );
  const sendingResult2 = await sendingRepository.removeById(
    testSendingId2,
    testAccountId
  );
  console.log(
    `sendingResult: ${sendingResult} sendingResult2: ${sendingResult2}`
  );

  const removeResult = await repository.removeById(
    testMessageId,
    testAccountId
  );

  console.log(`RemoveResult: ${removeResult}`);

  const deleteContactResponse = await request(contactsApp)
    .delete(`/contacts/${testContactId}?force=true`)
    .set("x-access-token", jwt);

  console.log(`deleteContactResponse: ${deleteContactResponse.status}`);

  const deleteContactResponse2 = await request(contactsApp)
    .delete(`/contacts/${testContactId2}?force=true`)
    .set("x-access-token", jwt);

  console.log(`deleteContactResponse: ${deleteContactResponse2.status}`);

  const deleteAccountEmailResponse = await request(accountsApp)
    .delete(
      `/accounts/settings/accountEmails/${testAccountEmailId}/?force=true`
    )
    .set("x-access-token", jwt);

  console.log(
    `deleteAccountEmailResponse: ${deleteAccountEmailResponse.status}`
  );

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

  it("POST /messages/sending - Deve retornar statusCode 202", async () => {
    const payload: ISending = {
      id: testSendingId,
      accountId: testAccountId,
      contactId: testContactId,
      messageId: testMessageId,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(202);
    expect(resultado.body.id).toEqual(testSendingId);
    expect(resultado.body.status).toEqual(SendingStatus.SENT);
  });

  it("POST /messages/sending - Deve retornar statusCode 401", async () => {
    const resultado = await request(app).post("/messages/sending");

    expect(resultado.status).toEqual(401);
  });

  it("POST /messages/sending - Deve retornar statusCode 404", async () => {
    const payload: ISending = {
      id: uuid(),
      accountId: testAccountId,
      contactId: testContactId,
      messageId: testMessageId,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("POST /messages/sending - Deve retornar statusCode 404", async () => {
    const payload: ISending = {
      id: testSendingId,
      accountId: 999999999,
      contactId: testContactId,
      messageId: testMessageId,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("POST /messages/sending - Deve retornar statusCode 404", async () => {
    const payload: ISending = {
      id: testSendingId,
      accountId: testAccountId,
      contactId: 999999999,
      messageId: testMessageId,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("POST /messages/sending - Deve retornar statusCode 404", async () => {
    const payload: ISending = {
      id: testSendingId,
      accountId: testAccountId,
      contactId: testContactId,
      messageId: 999999999,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(404);
  });

  it("POST /messages/sending - Deve retornar statusCode 422", async () => {
    const payload = {
      street: "Rua A",
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(422);
  });

  it("POST /messages/sending - Deve retornar statusCode 400", async () => {
    const payload: ISending = {
      id: testSendingId2,
      accountId: testAccountId,
      contactId: testContactId2,
      messageId: testMessageId,
    };

    const msJwt = await microservicesAuth.sign(payload);

    const resultado = await request(app)
      .post("/messages/sending")
      .set("x-access-token", `${msJwt}`)
      .send(payload);

    expect(resultado.status).toEqual(400);
  });
});
