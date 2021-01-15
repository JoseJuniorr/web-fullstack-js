import { Request, Response } from "express";
import repository from "../models/contactRepository";
import controllerCommons from "ms-commons/api/controllers/controller";
import { IContact } from "../models/contact";
import { ContactStatus } from "../models/contactStatus";

import { Token } from "ms-commons/api/auth";

async function getContacts(req: Request, res: Response, next: any) {
  try {
    const includeRemoved = req.query.includeRemoved == "true";
    const token = controllerCommons.getToken(res) as Token;
    const contacts = await repository.findAll(token.accountId, includeRemoved);
    res.json(contacts);
  } catch (error) {
    console.log(`getContacts: ${error}`);
    res.status(400).end();
  }
}

async function getContact(req: Request, res: Response, next: any) {
  try {
    const id = parseInt(req.params.id);

    if (!id) return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;
    const contact = await repository.findById(id, token.accountId);
    if (contact === null) return res.sendStatus(404);
    else res.status(200).json(contact);
  } catch (error) {
    console.log(`getContact: ${error}`);
    res.sendStatus(400);
  }
}

async function addContact(req: Request, res: Response, next: any) {
  try {
    const token = controllerCommons.getToken(res) as Token;
    const contact = req.body as IContact;
    const result = await repository.add(contact, token.accountId);
    res.status(201).json(result);
  } catch (error) {
    console.log(`addContact: ${error}`);
    res.sendStatus(400);
  }
}

async function setContact(req: Request, res: Response, next: any) {
  try {
    const contactId = parseInt(req.params.id);
    if (!contactId) return res.status(400).end();

    const token = controllerCommons.getToken(res) as Token;
    const contact = req.body as IContact;
    const result = await repository.set(contactId, contact, token.accountId);
    if (!result) res.status(404).end();
    res.json(result);
  } catch (error) {
    console.log(`setContact: ${error}`);
    res.status(400).end();
  }
}

async function deleteContact(req: Request, res: Response, next: any) {
  try {
    const contactId = parseInt(req.params.id);
    if (!contactId) return res.status(400).json({ message: "id is required" });

    const token = controllerCommons.getToken(res) as Token;

    if (req.query.force === "true") {
      await repository.removeById(contactId, token.accountId);
      res.status(200).end();
    } else {
      const contactParams = {
        status: ContactStatus.REMOVED,
      } as IContact;

      const updatedContact = await repository.set(
        contactId,
        contactParams,
        token.accountId
      );
      if (updatedContact) res.json(updatedContact);
      else res.status(403).end();
    }
  } catch (error) {
    console.log(`deleteContact: ${error}`);
    res.sendStatus(400);
  }
}

export default {
  getContacts,
  getContact,
  addContact,
  setContact,
  deleteContact,
};
