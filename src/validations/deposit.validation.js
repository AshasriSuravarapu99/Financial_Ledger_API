const Joi = require("joi");

exports.depositSchema = Joi.object({
  account_id: Joi.string().guid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  description: Joi.string().allow("")
});
