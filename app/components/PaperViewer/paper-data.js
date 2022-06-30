import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"

export function PaperData(props){
  return(
    <div className="PaperData" style={{
        border: '2px solid green',
        flex: 1,
        margin: '20px',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <PaperMetadata
        paperId={props.paperId}
        />
      <PaperAbstract
        paperId={props.paperId}
        />
    </div>
  )
}
