import { Form, useSubmit, useParams } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"
import { deslugifyDoi } from "~/utils/doi-manipulation"
import { nearestNewPaper } from "~/utils/algorithms"
import { pinCurrentPaper } from "~/utils/visited-papers"

export function ControlPanel(props) {
  const params = useParams();

  return (
    <div className="control-panel flex-column">
      <div className="panel"/>

      <div className="panel flex-column-space-between">
        <Form method="post" style = {{width: "100%"}}>
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)} />
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)} />
          <div className="switch">
            <button
              name="impression"
              type="submit"
              value="false"
              className="impression-button"
            >-</button>
            <button
              name="impression"
              type="submit"
              value="true"
              className="impression-button"
              >+</button>
          </div>
        </Form>
        <button onClick={() => pinCurrentPaper(props.setTraversalPath)}>Pin Paper</button>
      </div>
    </div>
  )
}
