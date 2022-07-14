import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect, useState, useRef } from 'react';
import { useActionData, useFetcher, Link } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { handleSearch } from "~/models/search.server"
import { clearTraversalPath } from "~/utils/visited-papers"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import * as localforage from "localforage";

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearch(searchString)

  // if(handleSearchOutput.action === 'redirect'){
  //
  //   // TODO: Clustering/algorithm initialisation happens here (?)
  //   // const testMicroservice = await clusterDOIs("10.1371/journal.pcbi.1008777")
  //   // Search params are used to carry messages from the search route to the $paperId route
  //   return redirect(`/${handleSearchOutput.doiString}?message=${handleSearchOutput.case}&searchString=${searchString}`, {
  //   })
  // }
  // If anything's returned here, it means there's an error, which is displayed in the Snackbar in seed-search
  return json({...handleSearchOutput, searchString: searchString})
}

export default function Search(){
  const actionData = useActionData();
  const [errorExists, setErrorExists] = useState(false)
  const fetcher = useFetcher();
  const ref = useRef();


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
    else if(actionData?.action === 'redirect'){
      fetcher.submit({
        doi: deslugifyDoi(actionData.doiString)
      }, {
        method: "post",
        action: "/cluster-papers"
      })
    }
  }, [actionData])

  useEffect(async()=>{
    console.log("FETCHER DATA:", fetcher.data)
    if(fetcher.data?.cluster){
      await localforage.setItem("clusters", fetcher.data.cluster.cluster)
      ref.current.click()
    }
  }, [fetcher.data])

  useEffect(()=>{
    console.log("FETCHER STATE:", fetcher.state)
  }, [fetcher.state])

  return(
    <>
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: 'column'}}>
      <SeedSearch
        errorExists={errorExists}
        setErrorExists={setErrorExists}
        errorData={actionData ? actionData : null}
      />
    {fetcher.state === 'submitting' && <h1>Algorithm is running!</h1>}
    </div>
    {fetcher.data?.cluster && <Link to={`/${actionData.doiString}?message=${actionData.case}&searchString=${actionData.searchString}`} ref={ref}/>}
    </>
  )
}
