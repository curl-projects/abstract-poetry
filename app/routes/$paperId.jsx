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
import { caseToMessage } from "~/utils/messages-and-alerts"

export const loader = async ({
  params, request
}) => {
  const url = new URL(request.url)
  const search = new URLSearchParams(url.search)
  const metadata = await getMetadataFromPaperId(deslugifyDoi(params.paperId))

  const data = {
    metadata: metadata,
    search: search.get('nodeId'),
    message: search.get('message'),
    searchString: search.get('searchString'),
    updateIndex: search.get('updateIndex'),
    impression: search.get('impression'),
  }
  return json(data)
}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const negativeDOIString = formData.get('negativeDOI')
  const positiveDOIString = formData.get('positiveDOI')
  const impression = formData.get('impression')
  // Determines whether the eager-loading has returned a result

  if(negativeDOIString){
    const positiveDOI = JSON.parse(positiveDOIString)
    const negativeDOI = JSON.parse(negativeDOIString)
    if(negativeDOI !== "" && (negativeDOI?.negativeImpressionDOI !== deslugifyDoi(params.paperId) && positiveDOI?.positiveImpressionDOI !== deslugifyDoi(params.paperId))){
      if(JSON.parse(impression)){
        return redirect(`/${slugifyDoi(positiveDOI.positiveImpressionDOI)}?updateIndex=${positiveDOI.positiveImpressionClusterIndex}&impression=true`)
      }
      return redirect(`/${slugifyDoi(negativeDOI.negativeImpressionDOI)}?updateIndex=${negativeDOI.negativeImpressionClusterIndex}&impression=false`)
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

  console.log("NEXT PAPERS:", nextPapers)
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if(data.search){
      await localforage.setItem("activeNodeId", data.search)
    }
    console.log("UPDATED!")
    updateTraversalPath(deslugifyDoi(params.paperId), data.updateIndex, data.impression, setTraversalPath, setNodeState, setAlgParams, setForceNodes)

    // TODO: might be unnecessary, using it for the control-panel form
    const clusters = await localforage.getItem('clusters')
    setClusters(clusters)
  }, [params.paperId, data.search])

  useEffect(() => {
    console.log("TRAVERSAL PATH:", traversalPath)
  }, [traversalPath])

  useEffect(() => {
    console.log("FORCE NODES:", forceNodes)
  }, [forceNodes])

  useEffect(() => {
    console.log("DATA:", data)
  }, [data])

  useEffect(()=>{
    console.log("ALG PARAMS STATE:", algParams)
  }, [algParams])

  useEffect(()=>{
    // Handle info messages passed from search
    if(data.message){
      setMessageExists(true)
      console.log(caseToMessage(data.messsage, data.searchString))
    }
  }, [data])

  useEffect(()=>{
    console.log("NODE STATE:", nodeState)
  }, [nodeState])


  useEffect(() => {
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return (
    <div className="container grid-view">
      <Header />

      <div className="axis" />

      <ControlPanel
        actionData={actionData}
        traversalPath={traversalPath}
        mostRecentNode={nodeState}
        setTraversalPath={setTraversalPath}
        algParams={algParams}
        clusters={clusters}
        metadata = {data.metadata? data.metadata : {}}

      />
      <PaperData
        doi={deslugifyDoi(params.paperId)}
        metadata={data.metadata ? data.metadata : {}}
      />

      <ClusterViewer
        forceNodes={forceNodes}
        />

      <Share
        traversalPath={traversalPath}

        />
      <Controls/>

      <Background />

      <Snackbar
        open={messageExists}
        autoHideDuration={6000}
        message={data.message && data.searchString ? caseToMessage(data.message, data.searchString) : ""}
        onClose={()=>setMessageExists(false)}
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

// <TraversalViewer
//   traversalPath={traversalPath}
//   nodeState={nodeState}
//   className="traversal-viewer"
// />
