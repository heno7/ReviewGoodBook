const Joi = require("joi");

const schema = Joi.object({
  book: Joi.object({
    name: Joi.string().not("draft book").min(1).required(),
    author: Joi.string().not("draft author").min(1).required(),
    genre: Joi.string().not("draft genre").min(3).required(),
  }),
  title: Joi.string().not("draft title").min(1).required(),
  content: Joi.string().min(100).required(),
  images: Joi.any(),
  status: Joi.string().equal("Complete").required(),
});

module.exports = function (data) {
  return schema.validate(data);
};
