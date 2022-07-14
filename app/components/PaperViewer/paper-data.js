import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"

import { useState } from "react"

export function PaperData(props) {

  const [toggle, setToggle] = useState(true)
  console.log(props.metadata)

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        setToggle = {setToggle}
        toggle = {toggle}
      />

      {toggle ?
        <PaperAbstract
          doi={props.doi}
          title={props.metadata.title ? props.metadata.title : ""}
          abstract={props.metadata.abstract ? props.metadata.abstract : ""}
        /> :
        <div className="flex-column" style={{ gap: 0, overflow: "auto" }}>

          {Array(10).fill(0).map((_, i) => {
            return (
              <PaperMetadata
                key={i}
                doi={props.doi}
                metadata={props.metadata}
              />
            )
          }


          )}

        </div>
      }
    </div>
  )
}