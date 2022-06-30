import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.ABSTRACTS_URL,
  token: process.env.ABSTRACTS_TOKEN
})

export async function getAbstractFromPaperId(paper_id){
  const abstract = await redis.get(paper_id)
  return abstract
}
