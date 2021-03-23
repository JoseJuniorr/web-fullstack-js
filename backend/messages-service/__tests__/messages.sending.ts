require("dotenv-safe").config({
  example: "../.env.example",
  path: "../.env",
});

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

import microservicesAuth from "../../__commons__/src/api/auth/microservicesAuth";

const token = microservicesAuth.sign({
  id: "27efc6eb-a993-4053-82b1-6d3aad419423",
  accountId: 1,
  contactId: 1,
  messageId: 1,
});

console.log(token);
