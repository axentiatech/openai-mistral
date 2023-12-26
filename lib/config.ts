import { z } from "zod";

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1),
  TOGETHER_API_KEY: z.string().trim().min(1),
});

export const env = envSchema.parse(process.env);
