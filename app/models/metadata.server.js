import { redis } from "~/models/redis.server"

export async function getMetadataFromPaperId(paper_id){
    const metadata = await redis.get(paper_id)
    return metadata
}
