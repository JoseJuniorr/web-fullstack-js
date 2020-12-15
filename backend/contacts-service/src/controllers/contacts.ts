import { Request, Response } from "express";

async function getContacts(req: Request, res: Response, next: any) {
  res.json([]);
}

export default { getContacts };
