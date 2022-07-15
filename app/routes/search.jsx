import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect, useState, useRef } from 'react';
import { useActionData, useFetcher, Link } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { handleSearch } from "~/models/search.server"
import { clearTraversalPath } from "~/utils/visited-papers"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import * as localforage from "localforage";

import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Header, Background, Share, Controls } from "~/components/PaperViewer/static.js"
import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearch(searchString)

  return json({...handleSearchOutput, searchString: searchString})
}

export default function Search(props){
  const actionData = useActionData();
  // TODO: rename this now, because it's used for both errors and algorithm progress
  const [errorExists, setErrorExists] = useState(false)
  const fetcher = useFetcher();
  const ref = useRef();


  useEffect(()=>{
    // Clears local storage whenever the search page loads, resetting the algorithm
      clearTraversalPath()
    }, [])


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
    if(fetcher.data?.cluster){
      await localforage.setItem("clusters", fetcher.data.cluster.cluster)
      ref.current.click()
    }
  }, [fetcher.data])

  useEffect(()=>{
    console.log("FETCHER STATE:", fetcher.state)
    // if(fetcher.state === "submitting"){
    //     setErrorExists(true)
    // }
  }, [fetcher.state])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])


  return(
    <>
    <div className="container grid-view">
      <Header />

      <div className="axis" />

      <ControlPanel/>
      <PaperData/>
      <TraversalViewer/>
      <Background />

      <Snackbar
        open={errorExists}
        autoHideDuration={4000}
        message={actionData ? actionData.message : "Clustering nearby papers"}
        onClose={()=>setErrorExists(false)}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              sx={{ p: 0.5 }}
              color="inherit"
              onClick={() => setErrorExists(false)}
              >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
      {fetcher.data?.cluster && <Link to={`/${actionData.doiString}?message=${actionData.case}&searchString=${actionData.searchString}`} ref={ref}/>}
      </div>
    </>
  )
}

// <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: 'column'}}>
//   <SeedSearch
//     errorExists={errorExists}
//     setErrorExists={setErrorExists}
//     errorData={actionData ? actionData : null}
//   />
// {fetcher.state === 'submitting' && <h1>Algorithm is running!</h1>}
// </div>
// {fetcher.data?.cluster && <Link to={`/${actionData.doiString}?message=${actionData.case}&searchString=${actionData.searchString}`} ref={ref}/>}
