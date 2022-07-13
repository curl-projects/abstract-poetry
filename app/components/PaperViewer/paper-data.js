import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"

export function PaperData(props) {
  return (
    <div className="paper-viewer">
      
      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
      />

      <PaperAbstract
        doi={props.doi}
        title={props.metadata.title ? props.metadata.title : ""}
        abstract={props.metadata.abstract ? props.metadata.abstract : ""}
      />
    </div>
  )
}
