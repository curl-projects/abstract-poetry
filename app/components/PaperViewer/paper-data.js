import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { PaperAbstract } from "~/components/PaperViewer/paper-abstract.js"
import { PaperList } from "~/components/PaperViewer/paper-list.js"
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

  return (
    <div className="paper-viewer">

      <PaperMetadata
        doi={props.doi}
        metadata={props.metadata}
        headerMessage={props.headerMessage}
        setToggle={props.setToggle}
      />

    {
      (props.toggle && props.paperList)
      ? <PaperList
          paperList={paperList}
          fetcher={props.fetcher}
          />
      : <PaperAbstract
          doi={props.doi}
          title={props.metadata ? props.metadata.title : ""}
          abstract={props.metadata ? props.metadata.abstract : ""}
          params={params}
        />
    }

    </div>
  )
}

// http://localhost:3000/share/cl6df3s440000j3315oa0mkg7
