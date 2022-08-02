import { useEffect, useState, useRef } from "react";
import { Outlet, useActionData, useLoaderData, useParams, useFetcher } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"

import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { ClusterViewer } from "~/components/PathTraversal/cluster-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { nearestNewPaper, clusterDOIs } from "~/models/backend-algorithms.server.js"
import { Background, Controls } from "~/components/PaperViewer/static.js"
import { Header } from "~/components/SeedSearch/search-header"
import { Share } from "~/components/PathTraversal/traversal-export.js"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"

import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
import { updateTraversalPath } from "~/utils/visited-papers"
import { pinCurrentPaper } from "~/utils/visited-papers"
import * as localforage from "localforage";

import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";

import { caseToMessage } from "~/utils/messages-and-alerts"
import { authenticator } from "~/models/auth.server.js";

export const loader = async ({
  params, request
}) => {
  const url = new URL(request.url)
  const search = new URLSearchParams(url.search)
  const metadata = await getMetadataFromPaperId(deslugifyDoi(params.paperId))
  const user = await authenticator.isAuthenticated(request)

  const data = {
    metadata: metadata,
    search: search.get('nodeId'),
    message: search.get('message'),
    searchString: search.get('searchString'),
    updateIndex: search.get('updateIndex'),
    impression: search.get('impression'),
    position: search.get('position'),
    user: user
  }
  return json(data)
}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const negativeDOIString = formData.get('negativeDOI')
  const positiveDOIString = formData.get('positiveDOI')
  const impression = formData.get('impression')
  // Determines whether the eager-loading has returned a result

  if (negativeDOIString) {
    const positiveDOI = JSON.parse(positiveDOIString)
    const negativeDOI = JSON.parse(negativeDOIString)
    if (negativeDOI !== "" && (negativeDOI?.negativeImpressionDOI !== deslugifyDoi(params.paperId) && positiveDOI?.positiveImpressionDOI !== deslugifyDoi(params.paperId))) {
      if (JSON.parse(impression)) {
        return redirect(`/${slugifyDoi(positiveDOI.positiveImpressionDOI)}?updateIndex=${positiveDOI.positiveImpressionClusterIndex}&impression=true`)
      }
      else{
        return redirect(`/${slugifyDoi(negativeDOI.negativeImpressionDOI)}?updateIndex=${negativeDOI.negativeImpressionClusterIndex}&impression=false`)
      }
    }
  }

  // this triggers when the user is faster than the preloading
  console.log("RUNNING ALGORITHM SYNCHRONOUSLY")
  const traversedPapers = formData.get('traversalPath')
  const nodeState = formData.get('mostRecentNode')
  const algParams = formData.get('algParams')
  const clusters = formData.get('clusters')

  // the final version of this needs to return a DOI and the updated algorithm parameters
  let [nextPapers, clusterIndex] = await nearestNewPaper(deslugifyDoi(params.paperId), impression, traversedPapers, nodeState, algParams, clusters)

  console.warn("NEXT PAPERS:", nextPapers)
  return(redirect(`/${slugifyDoi(nextPapers['id'])}?updateIndex=${clusterIndex}&impression=${impression}`))
}

export default function PaperId() {
  const params = useParams();
  const data = useLoaderData();
  const actionData = useActionData();
  const [traversalPath, setTraversalPath] = useState({})
  const [nodeState, setNodeState] = useState({})
  const [algParams, setAlgParams] = useState(null)
  const [pinningPaper, setPinningPaper] = useState(false)
  const [messageExists, setMessageExists] = useState(false)
  const [clusters, setClusters] = useState(null)
  const [forceNodes, setForceNodes] = useState(null)
  const skipFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const [traversalState, setTraversalState] = useState(true)
  const [visitedPathList, setVisitedPathList] = useState([])
  const [nodeIdCounter, setNodeIdCounter] = useState(1)
  const [toggle, setToggle] = useState(false)
  const [searchString, setSearchString] = useState("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (data.search) {
      await localforage.setItem("activeNodeId", data.search)
    }
    console.log("UPDATED!")
    updateTraversalPath(deslugifyDoi(params.paperId),
                        data.updateIndex,
                        data.impression,
                        setTraversalPath,
                        setNodeState,
                        setAlgParams,
                        setForceNodes,
                        setClusters,
                        setVisitedPathList,
                        setNodeIdCounter,
                        data.metadata
                      )
    setToggle(false)
    let searchStringData = await localforage.getItem("searchString")
    console.log("SEARCH STRING DATA")
    searchStringData ? setSearchString(searchStringData) : {}
  }, [params.paperId, data.search])

  useEffect(() => {
    console.warn("VISITED PATH LIST:", visitedPathList)
  }, [visitedPathList])

  useEffect(() => {
    console.log("LOADER DATA:", data)
  }, [data])
  //
  // useEffect(() => {
  //   console.log("FORCE NODES:", forceNodes)
  // }, [forceNodes])
  //
  useEffect(() => {
    console.log("DATA:", data)
  }, [data])

  useEffect(()=>{
    // Handle info messages passed from search
    if(data.message){
      setMessageExists(true)
    }
  }, [data.message])

  useEffect(() => {
    if(data.searchString){
      localforage.setItem("searchString", data.searchString)
      setSearchString(data.searchString)
    }
  }, [data.searchString])

  useEffect(()=>{
    console.log("CLUSTER SIZE:", clusters ? Object.keys(clusters).length : 0)
  }, [clusters])

  return (
    <div className="container grid-view">
      <Header
        activeNodeId={nodeState}
        algParams={algParams}
        clusters={clusters}
        forceNodes={forceNodes}
        nodeIdCounter={nodeIdCounter}
        searchString={searchString}
        traversalPath={traversalPath}
        user={data.user}
        />

      <div className="axis" />

      <ControlPanel
        actionData={actionData}
        traversalPath={traversalPath}
        mostRecentNode={nodeState}
        setTraversalPath={setTraversalPath}
        setForceNodes={setForceNodes}
        algParams={algParams}
        clusters={clusters}
        metadata={data.metadata ? data.metadata : {}}
      />
      <PaperData
        doi={deslugifyDoi(params.paperId)}
        metadata={data.metadata ? data.metadata : {}}
        toggle={toggle}
        setToggle={setToggle}
        paperList={visitedPathList}
        nodeState={nodeState}
        fetcher={redirectFetcher}
      />

      {traversalState ?
        <ClusterViewer
          forceNodes={forceNodes}
          nodeState={nodeState}
        />
        :
        <TraversalViewer
          traversalPath={traversalPath}
          nodeState={nodeState}
          className="traversal-viewer"
          position={data.position}
        />
      }

      <Share
        traversalPath={traversalPath}
      />

      <Controls
        setTraversalState={setTraversalState}
        traversalState={traversalState}
      />


      <Background />

      <Snackbar
        open={messageExists}
        autoHideDuration={6000}
        message={data.message && data.searchString ? caseToMessage(data.message, data.searchString) : ""}
        onClose={() => setMessageExists(false)}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              sx={{ p: 0.5 }}
              color="inherit"
              onClick={() => setMessageExists(false)}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}
