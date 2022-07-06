import { useEffect, useState } from "react";
import { Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { nearestNewPaper } from "~/models/backend-algorithms.server.js"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
import { updateVisitedPapers, updateTraversalPath } from "~/utils/visited-papers"
import ls from "local-storage"

export const loader = async ({
  params
}) => {
  let metadata = await getMetadataFromPaperId(deslugifyDoi(params.paperId))
  const data = {
    metadata: metadata,
  }
  return json(data)
}

export const action = async({ request, params }) => {
  const formData = await request.formData();
  const impression = formData.get('impression')
  const visitedPapers = formData.get('visitedPapers')
  let nearestVectors = await nearestNewPaper(deslugifyDoi(params.paperId), impression, visitedPapers, 5)
  return(redirect(`/${slugifyDoi(nearestVectors[0]['id'])}`))
}

export default function PaperId(){
  const params = useParams();
  const data = useLoaderData();
  const actionData = useActionData();
  const [visitedPapers, setVisitedPapers] = useState([])
  const [traversalPath, setTraversalPath] = useState({})

  useEffect(()=>{
    updateVisitedPapers(deslugifyDoi(params.paperId), setVisitedPapers)
    updateTraversalPath(deslugifyDoi(params.paperId), [1, 2], setTraversalPath)
  }, [params.paperId])

  useEffect(()=>{
    console.log(visitedPapers)
  }, [visitedPapers])

  useEffect(()=>{
    console.log("TRAVERSAL PATH:", traversalPath)
  }, [traversalPath])


  useEffect(()=>{
    console.log("DATA:", data)
  }, [data])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <div className="ComponentWrapper" style={{border: '2px dashed black',
                   height: "90%",
                   width: "80%",
                   display: "flex",
                   flexDirection: "column",
                   justifyContent: "center",
                   alignItems: "center"
                 }}>
        <div className="PaperViewer"style={{
            flex: 1.5,
            width: "90%",
            border: '2px dashed purple',
            display: "flex",
          }}>
          <ControlPanel
            actionData={actionData}
            visitedPapers={visitedPapers}
            />
            <PaperData
              doi={deslugifyDoi(params.paperId)}
              metadata={data.metadata ? data.metadata : {}}
            />
        </div>
        <TraversalViewer
          visitedPapers={visitedPapers}
          traversalPath={traversalPath}
          />
      </div>
    </div>
  )
}
//
// export const ErrorBoundary = ({error}) => {
//   return redirect(`/${slugifyDoi(params.paperId)}`)
// }
