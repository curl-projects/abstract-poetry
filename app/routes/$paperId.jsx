import { PaperViewer } from "~/components/PaperViewer/paper-viewer.js"

export default function PaperId(){
  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <PaperViewer />
    </div>
  )
}
