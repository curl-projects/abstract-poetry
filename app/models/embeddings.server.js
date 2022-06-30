export async function getKNNFromVector(vector, topK=1){
  let url = "https://embedding-db-ea3137b.svc.us-west1-gcp.pinecone.io/query"
  let data = {
    vector: vector,
    topK: topK
  }

  const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PINECONE_KEY
      },
      body: JSON.stringify(data)
  })
  return res
}

export async function getKNNFromId(id, topK=1){
  let url = "https://embedding-db-ea3137b.svc.us-west1-gcp.pinecone.io/query"
  let data = {
    id: id,
    topK: topK
  }

  const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PINECONE_KEY
      },
      body: JSON.stringify(data)
  })

  return res
}
