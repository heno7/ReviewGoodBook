const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

module.exports = function (data) {
  return schema.validate(data);
};
