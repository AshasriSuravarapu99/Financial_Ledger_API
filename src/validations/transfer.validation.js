const Joi = require("joi");

exports.transferSchema = Joi.object({
  source_account_id: Joi.string().guid().required(),
  destination_account_id: Joi.string().guid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  description: Joi.string().allow("")
});
