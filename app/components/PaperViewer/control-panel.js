import { Form, useSubmit, useParams } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import { nearestNewPaper } from "~/utils/algorithms"
import { pinCurrentPaper } from "~/utils/visited-papers"
import useKeyPress from "react-use-keypress"

export function ControlPanel(props){
  const params = useParams();
  const keys = ['p', "P", 'r', "R", 'ArrowLeft', "ArrowRight"]
  const positiveSubmitRef = useRef();
  const negativeSubmitRef = useRef();

  // TODO
  // FUNCTIONALITY
    // buttons in the control panel should be linked to keypresses
      // Right Arrow: Positive impression
      // Left Arrow: Negative impression
      // P: Pin

  useKeyPress(keys, event=>{
    console.log(event.key)

    if(event.key === 'p' || event.key === 'P'){
      pinCurrentPaper(props.setTraversalPath)
    }
    if(event.key === 'r' || event.key === "R"){
      window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank")
    }

    if(event.key === "ArrowLeft"){
      negativeSubmitRef.current.click()
    }
    if(event.key === "ArrowRight"){
      positiveSubmitRef.current.click()
    }
  })

  // functionhandleKeyDown(event){
  //   console.log("EVENT KEY:", event)
  // }

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
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)}/>
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)}/>
          <button
            name="impression"
            type="submit"
            value="false"
            ref={negativeSubmitRef}
            style={{
              margin: "10px",
              height: "40px"
            }}>Less Like This</button>
          <button
            name="impression"
            type="submit"
            value="true"
            ref={positiveSubmitRef}
            style={{
              margin: "10px",
              height: "40px"
            }}>More Like This</button>
        </Form>
          <button onClick={() => pinCurrentPaper(props.setTraversalPath)}>Pin Paper</button>
          <button onClick={()=> window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank")}>Read Paper</button>
        </div>

    </div>
  )
}
