import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect, useState } from 'react';
import { useActionData } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { handleSearch } from "~/models/search.server"
import { clearTraversalPath } from "~/utils/visited-papers"

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearch(searchString)

  if(handleSearchOutput.action === 'redirect'){
    // Search params are used to carry messages from the search route to the $paperId route
    return redirect(`/${handleSearchOutput.doiString}?message=${handleSearchOutput.case}&searchString=${searchString}`, {
    })
  }
  // If anything's returned here, it means there's an error, which is displayed in the Snackbar in seed-search
  return json(handleSearchOutput)
}

export default function Search(){
  const actionData = useActionData();
  const [errorExists, setErrorExists] = useState(false)

  useEffect(()=>{
    // Clears local storage whenever the search page loads, resetting the algorithm
      clearTraversalPath()
    }, [])

  useEffect(()=>{
    console.log("ACTIONDATA:", actionData)
  }, [actionData])

  useEffect(()=>{
    // Keeps track of search error state, opening and closing the snackbar
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
