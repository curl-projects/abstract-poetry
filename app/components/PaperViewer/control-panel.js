import { Form, useSubmit, useParams } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"

import glyph from "../../../public/assets/Glyph.svg";
import read from "../../../public/assets/Read.svg";
import pin from "../../../public/assets/Pin.svg";

import { deslugifyDoi } from "~/utils/doi-manipulation"
import { nearestNewPaper } from "~/utils/algorithms"
import { pinCurrentPaper } from "~/utils/visited-papers"

export function ControlPanel(props) {
  const params = useParams();

  return (
    <div className="control-panel flex-column">
      <div className="panel">
        <img src={glyph} alt="Glyph Logo" />
      </div>

      <div className="panel flex-column">
        <Form method="post" className="switch-wrapper">
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)} />
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)} />
          <div className="switch flex-row" style={{ gap: "0px" }}>
            <button
              name="impression"
              type="submit"
              value="false"
              className="impression-button"
            >
              <div className="circle left" />
            </button>
            <button
              name="impression"
              type="submit"
              value="true"
              className="impression-button"
            >
              <div className="circle right" />
            </button>
          </div>
        </Form>
        <div className="button-wrapper flex-row">
          <div className="button-column flex-column">
            <div className="button">
              <img className="anchor" src={pin} alt="Read Logo" />
              <div className="key">
                <div className="key-cap">
                  P
                </div>
                <div className="key-caption">
                  Pin
                </div>
              </div>
              <button onClick={() => pinCurrentPaper(props.setTraversalPath)} />
            </div>
            <div className="button">

              <img className="anchor" src={read} alt="Read Logo" />

              <div className="key">
                <div className="key-cap">
                  R
                </div>
                <div className="key-caption">
                  Read
                </div>
              </div>
              <button onClick={() => pinCurrentPaper(props.setTraversalPath)} />
            </div>
          </div>

          <div className="button pin">
            <div className="effect-1" />
            <div className="toggle">
              <div className="eye" />
            </div>
            <button onClick={() => pinCurrentPaper(props.setTraversalPath)}></button>
          </div>
        </div>
      </div>
    </div>
  )
}
