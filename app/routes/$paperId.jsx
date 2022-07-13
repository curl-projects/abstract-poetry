import { useEffect, useState } from "react";
import { Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { nearestNewPaper } from "~/models/backend-algorithms.server.js"
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
    searchString: search.get('searchString')
  }
  return json(data)
}

export const action = async({ request, params }) => {
  const formData = await request.formData();
  const impression = formData.get('impression')
  const traversedPapers = formData.get('traversalPath')
  const nodeState = formData.get('mostRecentNode')

  // the final version of this needs to return a DOI and the updated algorithm parameters
  let nearestVectors = await nearestNewPaper(deslugifyDoi(params.paperId), impression, traversedPapers, 5, nodeState)
  return(redirect(`/${slugifyDoi(nearestVectors['id'])}`))
}

export default function PaperId(){
  const params = useParams();
  const data = useLoaderData();
  const actionData = useActionData();
  const [traversalPath, setTraversalPath] = useState({})
  const [nodeState, setNodeState] = useState({})
  const [pinningPaper, setPinningPaper] = useState(false)
  const [messageExists, setMessageExists] = useState(false)

  useEffect(async()=>{
    // TODO:
    // the nearestNewPaper algorithm should return the new algorithm parameters, which are
    // then used here to update the traversal path

    // when traversing existing paths, node state is captured in a search parameter,
    // which is then read into local storage to ensure that updateTraversalPath is
    // working with the right information
    if(data.search){
      await localforage.setItem("activeNodeId", data.search)
    }
    updateTraversalPath(deslugifyDoi(params.paperId), [1, 2], setTraversalPath, setNodeState)
  }, [params.paperId, data.search])

  useEffect(()=>{
    console.log("TRAVERSAL PATH:", traversalPath)
  }, [traversalPath])


  useEffect(()=>{
    console.log("DATA:", data)
  }, [data])

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


  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center", overflow: 'hidden'}}>
      <div className="ComponentWrapper" style={{border: '2px dashed black',
                   height: "90%",
                   width: "80%",
                   display: "flex",
                   flexDirection: "column",
                   justifyContent: "center",
                   alignItems: "center",
                 }}>
        <div className="PaperViewer"style={{
            flex: 1.5,
            width: "90%",
            border: '2px dashed purple',
            display: "flex",
          }}>
          <ControlPanel
            actionData={actionData}
            traversalPath={traversalPath}
            mostRecentNode={nodeState}
            setTraversalPath={setTraversalPath}
            />
            <PaperData
              doi={deslugifyDoi(params.paperId)}
              metadata={data.metadata ? data.metadata : {}}
            />
        </div>
        <TraversalViewer
          traversalPath={traversalPath}
          nodeState={nodeState}
          />
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
    </div>
  )
}
//
// export const ErrorBoundary = ({error}) => {
//   return redirect(`/${slugifyDoi(params.paperId)}`)
// }
