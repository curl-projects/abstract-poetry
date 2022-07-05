import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: 'https://global-sterling-marlin-30591.upstash.io',
  token: 'AXd_ASQgOTZkNTJkOGUtNzM3MC00YzRlLThjN2EtOTI3OTljYTc4YTZlODZjNmU1MjMxMWQ1NGRlMGFmMWJmZDdjMjFkNTIwNTY=',
})

export async function getMetadataFromPaperId(paper_id){
    const metadata = await redis.get(paper_id)
    return metadata
}
