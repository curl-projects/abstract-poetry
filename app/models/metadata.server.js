import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.METADATA_URL,
  token: process.env.METADATA_TOKEN
})

export async function getMetadataFromPaperId(paper_id){
  const metadata = await redis.get(paper_id)
  return metadata
}
