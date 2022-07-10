import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect, useState } from 'react';
import { useActionData, useLoaderData } from "@remix-run/react"
import { json, redirect, createSession } from "@remix-run/node"
import { getKNNFromVector, getKNNFromDoi } from "~/models/embeddings.server.js"
import { checkDoi, handleSearch } from "~/models/search.server"
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation";
import { clearTraversalPath } from "~/utils/visited-papers"

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearch(searchString)

  if(handleSearchOutput.action === 'redirect'){
    console.log("MESSAGE:", handleSearchOutput.message)
    return redirect(`/${handleSearchOutput.doiString}?message=${handleSearchOutput.case}&searchString=${searchString}`, {
    })
  }
  return json(handleSearchOutput)
}

export default function Search(){
  const actionData = useActionData();
  const [errorExists, setErrorExists] = useState(false)

  useEffect(()=>{
      clearTraversalPath()
    }, [])

  useEffect(()=>{
    console.log("ACTIONDATA:", actionData)
  }, [actionData])
  
  useEffect(()=>{
    if(actionData?.action === 'error'){
      setErrorExists(true)
    }
  }, [actionData])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <SeedSearch
        errorExists={errorExists}
        setErrorExists={setErrorExists}
        errorData={actionData ? actionData : null}
      />
    </div>
  )
}
