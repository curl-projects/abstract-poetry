import { useEffect } from "react";
import { useParams, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/node"

import { getAbstractFromPaperId } from "~/models/abstracts.server.js"
import { getMetadataFromPaperId } from "~/models/metadata.server.js"

import { PaperData } from "~/components/PaperViewer/paper-data.js"

export const loader = async ({
  params
}) => {
  const abstract = await getAbstractFromPaperId(params.paperId)
  const metadata = await getMetadataFromPaperId(params.paperId)
  const data = {
    abstract: abstract,
    metadata: metadata,
  }
  return json(data)
}

export default function PaperIdIndex(){
  const params = useParams();
  const data = useLoaderData();

  useEffect(()=>{
    console.log("DATA:", data)
  }, [data])

  return(
    <PaperData
      paperId={params.paperId}
      abstract={data.abstract}
      metadata={data.metadata}
    />
  )
}
