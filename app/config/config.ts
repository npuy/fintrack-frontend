import { z } from "zod";
process.loadEnvFile();

const envSchema = z.object({
  PORT: z.string(),
  SESSION_SECRET: z.string(),
  BACKEND_URL: z.string(),
});

const envParsed = envSchema.safeParse({
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
  BACKEND_URL: process.env.BACKEND_URL,
});

if (!envParsed.success) {
  console.log(envParsed.error);
  throw new Error("Env variables are not valid");
}

export const env = envParsed.data;
