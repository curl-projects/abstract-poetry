import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"
import { SeedPapers } from "~/components/SeedSearch/seed-papers.js"
import { useState, useEffect } from "react"
import { useParams} from "@remix-run/react"

export function PaperData(props) {
  const params = useParams();
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    if(props.toggle){
        setToggle(true)
    }
  }, [props.toggle])

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        setToggle={setToggle}
        toggle={toggle}
        headerMessage={props.headerMessage}
      />

    {toggle && props.paperList ?
        <SeedPapers
          paperList={props.paperList}
          fetcher={props.fetcher}
          />
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
