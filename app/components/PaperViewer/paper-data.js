import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"

import { useState, useEffect } from "react"
import { useParams} from "@remix-run/react"

export function PaperData(props) {
  const params = useParams();
  const [toggle, setToggle] = useState(false)

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        setToggle={setToggle}
        toggle={toggle}
        headerMessage={props.headerMessage}
      />

      {toggle ?
        <div className="flex-column" style={{ gap: 0, overflow: "auto" }}>

          {props.paperList.map((metadata, i) => {
            return (
              <PaperMetadata
                key={i}
                doi={""}
                metadata={metadata}
                fetcher={props.fetcher}
              />
            )
          }
          )}
        </div>
        :
        <PaperAbstract
          doi={props.doi}
          title={props.metadata ? props.metadata.title : ""}
          abstract={props.metadata ? props.metadata.abstract : ""}
          params={params}
        />
      }

    </div>
  )
}
