import { SeedSearch } from "~/components/SeedSearch/seed-search.js"
import { useEffect, useState, useRef } from 'react';
import { useActionData, useLoaderData, useFetcher, Link } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { handleSearch, handleSearchv2 } from "~/models/search.server"
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
// import * as localforage from "localforage";
import { setItem, getItem, clearStorage } from "~/utils/browser-memory.client"

import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Background } from "~/components/PaperViewer/static.js"
import { Header } from "~/components/SeedSearch/search-header"
import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { SocialsBar } from "~/components/SocialFeatures/socials-bar"
import { authenticator } from "~/models/auth.server.js";
import { useMediaQuery } from 'react-responsive'

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  return { user }
}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearchv2(searchString)

  return json({...handleSearchOutput, searchString: searchString})
}

export default function Search(props){
  const actionData = useActionData();
  // TODO: rename this now, because it's used for both errors and algorithm progress
  const [errorExists, setErrorExists] = useState(false)
  const fetcher = useFetcher();
  const coldStartFetcher = useFetcher();
  const ref = useRef();
  const [paperSelection, setPaperSelection] = useState(false)
  const [headerMessage, setHeaderMessage] = useState("")
  const data = useLoaderData();
  const searchBarRef = useRef();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' })

  useEffect(()=>{
    console.log("IS TABLET OR MOBILE", isTabletOrMobile)
  }, [isTabletOrMobile])

  useEffect(()=>{
    coldStartFetcher.submit({}, {
      method: "post",
      action: "/warmup-microservice"
    })
    // Clears local storage whenever the search page loads, resetting the algorithm
    clearStorage();
  }, [])

  // useEffect(()=>{
  //   console.log("LOADER DATA:", data)
  // }, [data])

  useEffect(()=>{
    console.log("COLD START FETCHER DATA:", coldStartFetcher.data)
  }, [coldStartFetcher.data])

  useEffect(()=>{
    console.log("FETCHER DATA:", fetcher.data)
  }, [fetcher.data])

  useEffect(()=>{
    // Keeps track of search error state, opening and closing the snackbar
    if(actionData && actionData.action === 'error'){
      console.log("HELLO")
      setErrorExists(true)
      setHeaderMessage("Start searching with a DOI or keyword")
    }
    if(actionData?.action === 'select-papers'){
      setPaperSelection(true)
      setHeaderMessage("Choose a paper you're interested in, and we'll find the closest match in our database")
      console.log("DOI LIST DATA!!:", actionData.doiList)
    }
    else if(actionData?.action === 'redirect'){
      setHeaderMessage("Searching for relevant papers")
      fetcher.submit({
        doi: deslugifyDoi(actionData.doiString),
        keywordSearch: false,
        referencesList: actionData.referencesList
      }, {
        method: "post",
        action: "/cluster-papers"
      })
    }
  }, [actionData])

  useEffect(async()=>{
    if(fetcher.data){
      if(fetcher.data.cluster){
        await setItem("clusters", fetcher.data.cluster)
        ref.current.click()
      }
      else{
        setErrorExists(true)
      }
    }
  }, [fetcher.data])

  useEffect(()=>{
    console.log("FETCHER STATE:", fetcher.state)
    if(fetcher.state === "submitting"){
      setHeaderMessage(`Searching for relevant papers`)
    }
  }, [fetcher.state])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  useEffect(()=>{
    console.log("ERROR EXISTS:", errorExists)
  }, [errorExists])

  if(isTabletOrMobile){
    return(
      <div style={{display: 'flex',
                   justifyContent: "center",
                   alignItems: "center",
                   height: '100vh',
                   width: "100vw",
                   textAlign: "center",
                   padding: '30px'
                 }}>
        Hey! For now, we only support bigger screens. Thanks for checking us out though :)
      </div>
    )
  }
  else{

  return(
    <>
    <div className="container">
      <Header
        user={data.user}
        searchBarRef={searchBarRef}
        />

      <div className="axis" />

      <ControlPanel/>

      <PaperData
            toggle={paperSelection}
            paperList={actionData?.doiList ? actionData.doiList : Array(10).fill(0)}
            headerMessage={headerMessage}
            fetcher={fetcher}
            searchBarRef={searchBarRef}
            />

      <Background />

      <SocialsBar />

      <Snackbar
        open={errorExists}
        autoHideDuration={4000}
        message={actionData ? actionData.message : fetcher.data?.error}
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
    {fetcher.data?.cluster && <Link to={fetcher.data.seedDOI ?
                                            `/${slugifyDoi(fetcher.data.seedDOI)}?message=${actionData.case}&searchString=${actionData.searchString}`
                                          : `/${actionData.doiString}?message=${actionData.case}&searchString=${actionData.searchString}`} ref={ref}/>}
      </div>
    </>
)}
}
