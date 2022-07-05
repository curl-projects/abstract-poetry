import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect } from 'react';
import { useActionData } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { getKNNFromVector, getKNNFromDoi, checkDoi } from "~/models/embeddings.server.js"

export const action = async ({ request }) => {
  const formData = await request.formData();
  const doi = formData.get('doi')

  const exists = await checkDoi(doi)
  if(exists){
    return redirect(`/${doi}`)
  }
  const neighbors = await getKNNFromDoi(doi, 3);
  const data = {
    neighbors: neighbors,
    exists: exists
  }
  return json(data)
}

export default function Seed(){
  const actionData = useActionData();

  useEffect(()=>{
    console.log("actionData:", actionData)
  }, [actionData])

  return(
    <SeedSearch />
  )
}
