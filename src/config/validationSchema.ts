import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PW: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // OAuth
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  CALLBACK_URL: Joi.string().required(),

  // JWT
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REGISTER_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  REGISTER_TOKEN_EXPIRATION_TIME: Joi.number().required(),
});
