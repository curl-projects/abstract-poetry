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
    "includeValues": false,
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
