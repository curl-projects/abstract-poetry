import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"
import { SeedPapers } from "~/components/SeedSearch/seed-papers.js"
import { useState, useEffect } from "react"
import { useParams} from "@remix-run/react"
import { Introduction } from "~/components/SocialFeatures/introduction.js"

export function PaperData(props) {
  const [paperList, setPaperList] = useState([])
  const params = useParams();

  useEffect(()=>{
    if(params.paperId){
      let reversedPaperList = props.paperList.slice().reverse()
      let mappedPaperList = reversedPaperList.map(function(dataObj){
        let newObj = {...dataObj.model.attributes.metadata}
        newObj.nodeId = dataObj.model.attributes.nodeId
        newObj.doi = dataObj.model.attributes.doi
        return newObj
      })
      let filteredPaperList = mappedPaperList.filter(node => node.nodeId !== props.nodeState)

      setPaperList(filteredPaperList)
    }
  }, [props.paperList, props.nodeState])

  useEffect(() => {
    console.warn("FILTERED PAPER LIST:", paperList)
  }, [paperList])

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        headerMessage={props.headerMessage}
        setToggle={props.setToggle}
      />

    {
      (props.toggle && props.paperList && params.paperId)
      ? <SeedPapers
          paperList={paperList}
          fetcher={props.fetcher}
          />
      : (props.toggle && props.paperList && !params.paperId)
      ? <SeedPapers
          paperList={props.paperList}
          fetcher={props.fetcher}
          />
      : (params.paperId)
      ? <PaperAbstract
          doi={props.doi}
          title={props.metadata ? props.metadata.title : ""}
          abstract={props.metadata ? props.metadata.abstract : ""}
          params={params}
        />
      : <Introduction
          searchBarRef={props.searchBarRef}
      />
    }

    </div>
  )
}

// http://localhost:3000/share/cl6df3s440000j3315oa0mkg7
