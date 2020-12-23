import { Request, Response } from "express";

import commonsMiddleware from "ms-commons/api/routes/middlewares";

import { contactSchema, contactupdateSchema } from "../models/contactSchema";

function validateContactSchema(req: Request, res: Response, next: any) {
  return commonsMiddleware.validateSchema(contactSchema, req, res, next);
}
function validateUpdateAccountSchema(req: Request, res: Response, next: any) {
  return commonsMiddleware.validateSchema(contactupdateSchema, req, res, next);
}

export default { validateContactSchema, validateUpdateAccountSchema };
