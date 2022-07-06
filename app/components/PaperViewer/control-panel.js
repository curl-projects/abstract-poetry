import { Form, useSubmit, useParams } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"
import { getVisitedPapers, updateVisitedPapers } from "~/utils/visited-papers"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import { nearestNewPaper } from "~/utils/algorithms"

export function ControlPanel(props){
  const params = useParams();
  const [visitedPapers, setVisitedPapers] = useState([])

  useEffect(()=>{
    updateVisitedPapers(deslugifyDoi(params.paperId), setVisitedPapers)
  }, [params.paperId])

  useEffect(()=>{
    console.log(visitedPapers)
  }, [visitedPapers])

  return(
    <div className="ControlPanel" style={{
        border: '2px solid yellow',
        flex: 0.5,
        margin: "20px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>Control Panel</h1>
        <div className="ButtonWrapper" style={{
          display: 'flex',
        }}>
        <Form method="post">
          <input type="hidden" name="visitedPapers" value={visitedPapers}/>
          <button
            name="impression"
            type="submit"
            value="false"
            style={{
              margin: "10px",
              height: "40px"
            }}>Less Like This</button>
          <button
            name="impression"
            type="submit"
            value="true"
            style={{
              margin: "10px",
              height: "40px"
            }}>More Like This</button>
        </Form>
        </div>

    </div>
  )
}
