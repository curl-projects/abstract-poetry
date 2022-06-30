import { SeedSearch } from "~/components/SeedSearch/seed-search.js"

import { useEffect } from 'react';
import { useActionData } from "@remix-run/react"
import { json } from "@remix-run/node"
import { getKNNFromVector } from "~/models/embeddings.server.js"

export const action = async ({ request }) => {
  const formData = await request.formData();
  const corpusId = formData.get('corpusId')

  const neighbors = await getKNNFromVector(corpusId, 1);

  const data = {
    neighbors: neighbors
  }

  return json(data)
}

export default function Seed(){
  const actionData = useActionData();

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <SeedSearch />
    </div>
  )
}
