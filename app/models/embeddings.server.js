import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: 'https://global-sterling-marlin-30591.upstash.io',
  token: 'AXd_ASQgOTZkNTJkOGUtNzM3MC00YzRlLThjN2EtOTI3OTljYTc4YTZlODZjNmU1MjMxMWQ1NGRlMGFmMWJmZDdjMjFkNTIwNTY=',
})

export async function getKNNFromVector(vector, topK=1){
  let url = "https://embedding-db-ea3137b.svc.us-west1-gcp.pinecone.io/query"
  let data = {
    "vector": vector,
    "includeValues": true,
    "topK": topK,
  }

  const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PINECONE_KEY
      },
      body: JSON.stringify(data)
  })

  return res.json()
}

export async function getKNNFromDoi(doi, topK=1){
  let url = "https://embedding-db-ea3137b.svc.us-west1-gcp.pinecone.io/query"
  let data = {
    "id": doi,
    "includeValues": true,
    "topK": topK,
  }

  let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PINECONE_KEY
      },
      body: JSON.stringify(data)
  })

  return res.json()
}
