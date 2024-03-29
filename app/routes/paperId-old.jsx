import { useEffect, useState, useRef } from "react";
import { Outlet, useActionData, useLoaderData, useParams, useFetcher } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"

import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { ClusterViewer } from "~/components/PathTraversal/cluster-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { SocialsBar } from "~/components/SocialFeatures/socials-bar.js"
import { nearestNewPaper, clusterDOIs } from "~/models/backend-algorithms.server.js"
import { Background, Controls } from "~/components/PaperViewer/static.js"
import { PaperHeader } from "~/components/PaperViewer/paper-header"
import { Share } from "~/components/PathTraversal/traversal-export.js"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"
import Tour from "~/components/SocialFeatures/tour.client"
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
import { updateTraversalPath } from "~/utils/visited-papers"
import { pinCurrentPaper } from "~/utils/visited-papers"
// import * as localforage from "localforage";
import { setItem, getItem } from "~/utils/browser-memory.client"

import { ClientOnly } from "remix-utils";

import Snackbar from "@mui/material/Snackbar";

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";

import { caseToMessage } from "~/utils/messages-and-alerts"
import { authenticator } from "~/models/auth.server.js";

import { Counter, getKeyByValue, getClusterPapers } from "~/utils/cluster-manipulation";

const steps = [
  {
    content: "Hey! Welcome to Abstract Poetry. This interface probably looks very different than the search engines that you’re used to, so we wrote this to provide an introduction to the way that we think about search.",
  },
  {
    selector: '#searchbar',
    content: 'Search in Abstract Poetry starts with a keyword or DOI. If you search with a keyword, we’ll show you some example papers to get started with. Choose the one that’s closest to what you’re looking for, and we’ll find the closest match to it in our database. Use the home button to start a new search.'
  },
  {
    selector: '#impression-buttons',
    content: 'After that initial search, your job is to provide impressions on the papers that the search engine finds: whether you want more or less like what we’re showing you. You can use these buttons, or the left and right arrow keys! Try pressing one of them, and the example paper and cluster viewer will update.'
  },
  {
    selector: '#control-buttons',
    content: 'At any point, you can pin or read the paper that you’re looking at. Either use these buttons, or the “P” and “R” keys. Try pressing the Pin button.'
  },
  {
    selector: '#export-button',
    content: 'You can export your pinned papers at any time with this button.'
  },
  {
    selector: '.user-control-wrapper',
    content: 'You can also save your paths and share them with others with the toolbar up here.'
  },
  {
    selector: '.force-graph-container',
    content: 'The cluster view shows you the groups of papers that the computer has decided are similar to each other. The goal of our algorithm is to identify the clusters that you find the most interesting, so you can use the cluster viewer to understand the patterns that the search engine’s working with. Click on any of the nodes to view the associated paper. Pinned papers have a purple outline, and the paper that you’re currently on is coloured black. Try dragging the clusters around!'
  },
  {
    selector: '.rd3t-tree-container',
    content: 'The path view shows you all of the decisions that you’ve made in your search, and allows you to go back and change any of them. When you do, a new path is created, with all of the computer’s knowledge reverted to its previous state.'
  },
  {
    selector: '.paper-viewer',
    content: 'If you want to browse through all of the papers that you’ve visited before, click the title or press "L" and you can see a list view of them. Try it now!'
  },
  {
    selector: "#home-button",
    content: "Use this button to restart your search. Click it now if you want to try Abstract Poetry out for yourself, or close this box if you want to play around with our example search."
  }
]


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
    tour: search.get('tour'),
    user: user,
    isPathRedirect: JSON.parse(search.get('isPathRedirect')),
    isSaveOpen: JSON.parse(search.get("isSaveOpen")),
    urlPrefix: process.env.SHARE_URL_PREFIX,
  }
  return json(data)
}

export const action = async ({ request, params }) => {
  const url = new URL(request.url)
  const search = new URLSearchParams(url.search)

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
  const [pathId, setPathId] = useState("")
  const [isPathRedirect, setIsPathRedirect] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [existingPathName, setExistingPathName] = useState(null)
  const [tourOpen, setTourOpen] = useState(false)
  const [clusterCounter, setClusterCounter] = useState({})

  useEffect(()=>{
    if(data.isSaveOpen){
      setShareModalOpen(true)
    }
  }, [data.isSaveOpen])

  const controlTourState = (curr) => {
    switch(curr){
      case 7:
        setTraversalState(false)
    }
  }

  useEffect(() => {
    if(data.tour){
      setTourOpen(true)
    }
  }, [data.tour])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (data.search) {
      await setItem("activeNodeId", data.search)
    }
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
                        setClusterCounter,
                        data.metadata
                      )
    setToggle(false)
    let searchStringData = await getItem("searchString")
    searchStringData ? setSearchString(searchStringData) : {}

    let pathIdData = await getItem('pathId')
    pathIdData ? setPathId(pathIdData) : {}

    let existingPathNameData = await getItem("pathName")
    existingPathNameData ? setExistingPathName(existingPathNameData) : {}

    if(data.isPathRedirect){
      setIsPathRedirect(true)
    }

    let clusterCounter = await getItem('clusterCounter');

    const thresholdIndex = Object.values(clusterCounter).findIndex(function(clusterCount){
      return clusterCount > 2
    })

    if(thresholdIndex !== -1){
        let clusterKey = Object.keys(clusterCounter)[thresholdIndex]
        let clusters = await getItem('clusters')
        let doiList = getClusterPapers(clusters, clusterKey)
    }

  }, [params.paperId, data.search, data.isPathRedirect])

  useEffect(async() => {
    let clusterCounter = await getItem('clusterCounter');

    const thresholdIndex = Object.values(clusterCounter).findIndex(function(clusterCount){
      return clusterCount > 2
    })

    if(thresholdIndex !== -1){
        let clusterKey = Object.keys(clusterCounter)[thresholdIndex]
        let clusters = await getItem('clusters')
        let doiList = getClusterPapers(clusters, clusterKey)
    }
  }, [params.paperId])


  useEffect(()=>{
    // Handle info messages passed from search
    if(data.message){
      setMessageExists(true)
    }
  }, [data.message])

  useEffect(async() => {
    if(data.searchString){
      await setItem("searchString", JSON.stringify(data.searchString))
      setSearchString(JSON.stringify(data.searchString))
    }
  }, [data.searchString])


  return (
    <div className="container grid-view">
      <PaperHeader
        activeNodeId={nodeState}
        algParams={algParams}
        clusters={clusters}
        nodeIdCounter={nodeIdCounter}
        searchString={searchString}
        traversalPath={traversalPath}
        pathId={pathId}
        user={data.user}
        urlPrefix={data.urlPrefix}
        setPathId={setPathId}
        saveModalOpen={saveModalOpen}
        setSaveModalOpen={setSaveModalOpen}

        shareModalOpen={shareModalOpen}
        setShareModalOpen={setShareModalOpen}
        existingPathName={existingPathName}
        setExistingPathName={setExistingPathName}

        clusterCounter={clusterCounter}
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
        setToggle={setToggle}
        saveModalOpen={saveModalOpen}
        shareModalOpen={shareModalOpen}
        tourOpen={tourOpen}
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
          isPathRedirect={isPathRedirect}
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
      <SocialsBar />

      <ClientOnly>
        {
          ()=><Tour
                accentColor="rgb(48, 76, 156)"
                isOpen={tourOpen}
                onRequestClose={()=>setTourOpen(false)}
                steps={steps}
                getCurrentStep={(curr)=>controlTourState(curr)}
                className="ap-tour-helper"
                closeWithMask={false}
              />
        }
      </ClientOnly>
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
