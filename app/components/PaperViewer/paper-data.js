import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"

import { useState } from "react"
import { useParams} from "@remix-run/react"

export function PaperData(props) {
  const params = useParams();
  const [toggle, setToggle] = useState(true)

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        setToggle={setToggle}
        toggle={toggle}
        params={params}
      />

      {toggle ?
        <PaperAbstract
          doi={props.doi}
          title={props.metadata ? props.metadata.title : ""}
          abstract={props.metadata ? props.metadata.abstract : ""}
          params={params}
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
