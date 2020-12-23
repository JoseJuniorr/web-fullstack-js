import Joi from "joi";

const contactSchema = Joi.object({
  id: Joi.number().integer().min(1),
  accountId: Joi.number().integer().min(1),
  name: Joi.string().min(3).max(150).required(),
  email: Joi.string().email().min(6).max(150).required(),
  phone: Joi.string()
    .min(10)
    .max(11)
    .pattern(/[0-9]{10,11}$/),
  status: Joi.number().integer().min(100).max(400),
});

const contactupdateSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),

  phone: Joi.string()
    .min(10)
    .max(11)
    .pattern(/[0-9]{10,11}$/),
  status: Joi.number().integer().min(100).max(400),
});

export { contactSchema, contactupdateSchema };
