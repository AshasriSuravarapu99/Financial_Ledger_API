const Joi = require("joi");

exports.createAccountSchema = Joi.object({
  user_id: Joi.string().required(),
  account_type: Joi.string().valid("checking", "savings").required(),
  currency: Joi.string().length(3).required()
});
