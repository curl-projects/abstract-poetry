import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.METADATA_URL,
  token: process.env.METADATA_TOKEN
})
