import { Request, Response } from "express";
import repository from "../models/messageRepository";
import controllerCommons from "ms-commons/api/controllers/controller";
import { IMessage } from "../models/message";
import { Token } from "ms-commons/api/auth";
import { MessageStatus } from "../models/messageStatus";
import { getContacts } from "ms-commons/api/clients/contactsService";
import queueService from "../../queueService";
import { IQueueMessage } from "../models/queueMessage";

async function getMessage(req: Request, res: Response, next: any) {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).end();
    const token = controllerCommons.getToken(res) as Token;
    const message = await repository.findById(id, token.accountId);

    if (message === null) res.status(404).end();
    else res.json(message);
  } catch (error) {
    console.log(`getMessage: ${error}`);
    res.sendStatus(400);
  }
}

async function getMessages(req: Request, res: Response, next: any) {
  try {
    const includeRemoved = req.query.includeRemoved == "true";

    const token = controllerCommons.getToken(res) as Token;
    const messages = await repository.findAll(token.accountId, includeRemoved);
    res.json(messages);
  } catch (error) {
    console.log(`getMessages: ${error}`);
    res.sendStatus(400);
  }
}

async function addMessage(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const message = req.body as IMessage;
    const result = await repository.add(message, token.accountId);
    res.status(201).json(result);
  } catch (error) {
    console.log(`addMessage: ${error}`);
    res.status(400).end();
  }
}

async function setMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).end();

    const token = controllerCommons.getToken(res) as Token;
    const message = req.body as IMessage;
    const result = await repository.set(messageId, message, token.accountId);

    if (!result) res.status(404).end();
    res.json(result);
  } catch (error) {
    console.log(`setMessage: ${error}`);
    res.status(400).end();
  }
}

async function deleteMessage(req: Request, res: Response, next: any) {
  try {
    const messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;

    if (req.query.force === "true") {
      await repository.removeById(messageId, token.accountId);
      res.status(200).end();
    } else {
      const messageParams = {
        status: MessageStatus.REMOVED,
      } as IMessage;

      const updatedMessage = await repository.set(
        messageId,
        messageParams,
        token.accountId
      );
      if (updatedMessage) res.json(updatedMessage);
      else res.status(403).end();
    }
  } catch (error) {
    console.log(`deleteMessage: ${error}`);
    res.sendStatus(400);
  }
}

async function sendMessage(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;

    //opbtendo a mensagem
    let messageId = parseInt(req.params.id);
    const message = repository.findById(messageId, token.accountId);

    if (!message) return res.status(403).end();

    //obtendo os contatos
    const contacts = await getContacts(token.jwt!);
    if (!contacts || contacts.length === 0) return res.status(400).end();

    //enviar a mensagem para a fila
    const promisses = contacts.map((item) => {
      return queueService.sendMessage({
        accountId: token.accountId,
        contactId: item.id,
        messageId: messageId,
      } as IQueueMessage);
    });

    await Promise.all(promisses);

    //atualizando a mensagem
    const messageParams = {
      status: MessageStatus.SENT,
      sendDate: new Date(),
    } as IMessage;

    const updatedMessage = repository.set(
      messageId,
      messageParams,
      token.accountId
    );

    if (updatedMessage) return res.json(updatedMessage);
    else return res.status(403).end();
  } catch (error) {
    console.log(`sendMessage: ${error}`);
    res.sendStatus(400);
  }
}

export default {
  getMessage,
  getMessages,
  addMessage,
  setMessage,
  deleteMessage,
  sendMessage,
};
