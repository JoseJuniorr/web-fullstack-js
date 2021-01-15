import { Request, Response } from "express";
import repository from "../models/messageRepository";
import controllerCommons from "ms-commons/api/controllers/controller";
import { IMessage } from "../models/message";
import { Token } from "ms-commons/api/auth";
import { MessageStatus } from "../models/messageStatus";

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

export default {
  getMessage,
  getMessages,
  addMessage,
  setMessage,
  deleteMessage,
};
