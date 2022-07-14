import * as localforage from "localforage";
import { useEffect, useState } from "react";
import { Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"

import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { Header, Background } from "~/components/PaperViewer/static.js"

import { nearestNewPaper } from "~/models/backend-algorithms.server.js"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"

import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
import { updateTraversalPath } from "~/utils/visited-papers"
import { pinCurrentPaper } from "~/utils/visited-papers"

export const loader = async ({
  params, request
}) => {
  const url = new URL(request.url)
  const search = new URLSearchParams(url.search)
  let metadata = await getMetadataFromPaperId(deslugifyDoi(params.paperId))
  const data = {
    metadata: metadata,
    search: search.get('nodeId')
  }
  return json(data)
}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const impression = formData.get('impression')
  const traversedPapers = formData.get('traversalPath')
  const nodeState = formData.get('mostRecentNode')

  // the final version of this needs to return a DOI and the updated algorithm parameters
  let nearestVectors = await nearestNewPaper(deslugifyDoi(params.paperId), impression, traversedPapers, 5, nodeState)
  return (redirect(`/${slugifyDoi(nearestVectors['id'])}`))
}

export default function PaperId() {
  const params = useParams();
  const data = useLoaderData();
  const actionData = useActionData();
  const [traversalPath, setTraversalPath] = useState({})
  const [nodeState, setNodeState] = useState({})
  const [pinningPaper, setPinningPaper] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // TODO:
    // the nearestNewPaper algorithm should return the new algorithm parameters, which are
    // then used here to update the traversal pat
    if (data.search) {
      await localforage.setItem("activeNodeId", data.search)
    }
    updateTraversalPath(deslugifyDoi(params.paperId), [1, 2], setTraversalPath, setNodeState)
  }, [params.paperId])

  useEffect(() => {
    console.log("TRAVERSAL PATH:", traversalPath)
  }, [traversalPath])


  useEffect(() => {
    console.log("DATA:", data)
  }, [data])

  useEffect(() => {
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
      />
      <PaperData
        doi={deslugifyDoi(params.paperId)}
        metadata={data.metadata ? data.metadata : {}}
      />
      <TraversalViewer
        traversalPath={traversalPath}
        nodeState={nodeState}
        className="traversal-viewer"
      />

      <Background />

    </div>
  )
}
//
// export const ErrorBoundary = ({error}) => {
//   return redirect(`/${slugifyDoi(params.paperId)}`)
// }
