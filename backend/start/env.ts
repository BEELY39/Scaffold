/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DATABASE_URL: Env.schema.string.optional(),
  DB_HOST: Env.schema.string.optional(),
  DB_PORT: Env.schema.number.optional(),
  DB_USER: Env.schema.string.optional(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for Google OAuth
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
  GOOGLE_CALLBACK_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for Gemini AI
  |----------------------------------------------------------
  */
  GEMINI_API_KEY: Env.schema.string(),
  GEMINI_API_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for Email Verification (Maileroo/Zeruh)
  |----------------------------------------------------------
  */
  MAILEROO_API_KEY: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for Stripe Payments
  |----------------------------------------------------------
  */
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),
  STRIPE_PRICE_ID_PRO: Env.schema.string(),
  FRONTEND_URL: Env.schema.string(),
})
