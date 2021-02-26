import { Request, Response } from "express";
import repository from "../models/messageRepository";
import controllerCommons from "ms-commons/api/controllers/controller";
import { IMessage } from "../models/message";
import { Token } from "ms-commons/api/auth/accountsAuth";
import { MessageStatus } from "../models/messageStatus";
import {
  getContacts,
  getContact,
} from "ms-commons/api/clients/contactsService";
import queueService from "ms-commons/api/clients/queueService";
import { IQueueMessage } from "../models/queueMessage";
import sendingRepository from "../models/sendingRepository";
import { SendingStatus } from "../models/sendingStatus";
import { ISending } from "../models/sending";
import messageRepository from "../models/messageRepository";

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
      res.sendStatus(204);
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

async function scheduleMessage(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    // console.log(token);

    //opbtendo a mensagem
    let messageId = parseInt(req.params.id);
    if (!messageId) return res.status(400).json({ message: "id is required" });

    const message = await repository.findById(messageId, token.accountId);

    if (!message) return res.sendStatus(403);

    //obtendo os contatos
    const contacts = await getContacts(token.jwt!);
    if (!contacts || contacts.length === 0)
      return res
        .status(404)
        .json({ message: "There are no contacts for this account." });

    //criar as sendings
    const sendings = await sendingRepository.addAll(
      contacts.map((contact) => {
        return {
          accountId: token.accountId,
          contactId: contact.id,
          messageId,
          status: SendingStatus.QUEUED,
        };
      })
    );

    if (!sendings)
      return res.status(400).json({ message: "Couldn't save the sendings." });

    //simplificar o sendings para a fila
    const messages = sendings.map((item) => {
      return {
        id: item.id,
        accountId: item.accountId,
        contactId: item.contactId,
        messageId: item.messageId,
      } as IQueueMessage;
    });

    //enviar a mensagem para a fila
    const promisses = queueService.sendMessageBatch(messages);
    await Promise.all(promisses);

    //atualizando a mensagem
    const messageParams = {
      status: MessageStatus.SCHEDULED,
      sendDate: new Date(),
    } as IMessage;

    const updatedMessage = await repository.set(
      messageId,
      messageParams,
      token.accountId
    );

    if (updatedMessage) return res.status(202).json(updatedMessage);
    else return res.sendStatus(403);
  } catch (error) {
    console.log(`sendMessage: ${error}`);
    res.sendStatus(400);
  }
}

async function sendMessage(req: Request, res: Response, next: any) {
  try {
    const params = req.body as ISending;

    //pegando o envio
    const sending = await sendingRepository.findQueuedOne(
      params.id!,
      params.messageId,
      params.accountId,
      params.contactId
    );

    if (!sending) return res.status(404).json({ message: "sending not found" });

    //todo: implementar cache no futuro

    //pegando a mensagem
    const message = await messageRepository.findById(
      sending.messageId,
      sending.accountId
    );
    if (!message) return res.status(404).json({ message: "message not found" });

    //pegando o contato(destinatário)
    const contact = await getContact(sending.contactId, sending.accountId);
    if (!contact) return res.status(404).json({ message: "contact not found" });

    //pegando o account email Remetente

    //enviando o email (SES)

    //atualizando a message
  } catch (error) {
    console.log(`sendMessage: ${error}`);
    return res.status(400);
  }
}

export default {
  getMessage,
  getMessages,
  addMessage,
  setMessage,
  deleteMessage,
  scheduleMessage,
  sendMessage,
};
