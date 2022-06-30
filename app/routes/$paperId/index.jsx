import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { useParams } from "@remix-run/react"

export default function PaperIdIndex(){
  const params = useParams();

  return(
    <PaperData
      paperId={params.paperId}
    />
  )
}
