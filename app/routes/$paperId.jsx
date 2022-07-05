import { useEffect } from "react";
import { Outlet, useActionData, useParams } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { ControlPanel } from "~/components/PaperViewer/control-panel.js"
import { TraversalViewer } from "~/components/PathTraversal/traversal-viewer.js"
import { processImpressions } from "~/models/process-impressions.server.js"
import { slugifyDoi } from "~/utils/doi-manipulation"

export const action = async({ request }) => {
  const formData = await request.formData();
  const impression = formData.get('impression')
  const nearestVector = await processImpressions(impression, [])
  const data = {
    nearestVector: nearestVector
  }
  return json(data)
}

export default function PaperId(){
  const params = useParams();
  const actionData = useActionData();

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
          <ControlPanel />
          <Outlet />
        </div>
        <TraversalViewer params={params}/>
      </div>
    </div>
  )
}
// 
// export const ErrorBoundary = ({error}) => {
//   return redirect(`/${slugifyDoi(params.paperId)}`)
// }
