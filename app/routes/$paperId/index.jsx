import { useEffect } from "react";
import { useParams, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/node"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"
import { deslugifyDoi } from "~/utils/doi-manipulation"

import { PaperData } from "~/components/PaperViewer/paper-data.js"

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
    console.log("METADATA:", data)
  }, [data])

  return(
    <PaperData
      doi={deslugifyDoi(params.paperId)}
      metadata={data.metadata ? data.metadata : {}}
    />
  )
}
