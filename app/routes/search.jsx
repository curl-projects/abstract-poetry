import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect } from 'react';
import { useActionData } from "@remix-run/react"
import { json, redirect, createSession } from "@remix-run/node"
import { getKNNFromVector, getKNNFromDoi, checkDoi } from "~/models/embeddings.server.js"
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation";
import { clearTraversalPath } from "~/utils/visited-papers"

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const doi = formData.get('doi')
  const exists = await checkDoi(doi)
  if(exists){
    return redirect(`/${slugifyDoi(doi)}`)
    }
  else{
    const data = {
      errorCode: 404,
      error: 'DOI NOT FOUND',
    }
    return json(data)
  }
}

export default function Search(){
  const actionData = useActionData();

  useEffect(()=>{
    clearTraversalPath()
  }, [])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <SeedSearch
        errorCode={actionData ? actionData.errorCode : null}
      />
    </div>
  )
}
