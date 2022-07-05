import { useEffect } from "react";
import { useParams, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/node"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import { updateVisitedPapers } from "~/utils/visited-papers"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import ls from "local-storage"

export const loader = async ({
  params
}) => {
  let metadata = await getMetadataFromPaperId(deslugifyDoi(params.paperId))
  const data = {
    metadata: metadata,
  }
  return json(data)
}

export default function PaperIdIndex(){
  const params = useParams();
  const data = useLoaderData();

  useEffect(()=>{
    updateVisitedPapers(params.paperId)
    ls.get('visitedPapers')
  }, [])

  useEffect(()=>{
    console.log("METADATA:", data)
    console.log("VISITEDPAPERS:", ls.get('visitedPapers'))
  }, [data])

  return(
    <PaperData
      doi={deslugifyDoi(params.paperId)}
      metadata={data.metadata ? data.metadata : {}}
    />
  )
}
