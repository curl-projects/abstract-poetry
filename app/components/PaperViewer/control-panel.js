import { Form, useParams, useFetcher, Link } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"
import { deslugifyDoi, slugifyDoi } from "~/utils/doi-manipulation";
import { pinCurrentPaper } from "~/utils/visited-papers"
import useKeyPress from "react-use-keypress";
import * as localforage from "localforage";

import glyph from "../../../public/assets/glyph.svg";
import read from "../../../public/assets/read.svg";
import pin from "../../../public/assets/pin.svg";

export function ControlPanel(props) {
  const params = useParams();
  const keys = ['p', "P", 'r', "R", "e", "E", 'ArrowLeft', "ArrowRight"]
  const positiveSubmitRef = useRef();
  const negativeSubmitRef = useRef();
  const exportRef = useRef();
  const inactiveRef = useRef();
  const fetcher = useFetcher();
  const [negativeDOI, setNegativeDOI] = useState(null);
  const [positiveDOI, setPositiveDOI] = useState(null);
  const [toggle, setToggle] = useState(true);

  // ANDRE: EAGER LOADING
  useEffect(async()=>{
    if(params.paperId){
      if((Object.keys(props.traversalPath).length !== 0) && (typeof props.mostRecentNode === "number") && props.algParams && props.clusters){
        fetcher.submit({doi: deslugifyDoi(params.paperId),
                        traversalPath: JSON.stringify(props.traversalPath),
                        mostRecentNode: JSON.stringify(props.mostRecentNode),
                        algParams: JSON.stringify(props.algParams),
                        clusters: JSON.stringify(await localforage.getItem("clusters"))
                      },

                        {method: "post", action: '/preload-impressions'})
      }
    }
  }, [props.traversalPath, props.mostRecentNode, props.algParams, props.clusters])

  useEffect(()=>{
    console.log("FETCHER DATA:", fetcher.data)
  }, [fetcher.data])

  useEffect(()=>{
    // Saves prefetched doi's into state
    if(fetcher.data?.negativeImpression){
        setNegativeDOI({negativeImpressionDOI: fetcher.data.negativeImpression.id, negativeImpressionClusterIndex: fetcher.data.negativeImpressionClusterIndex})
        setPositiveDOI({positiveImpressionDOI: fetcher.data.positiveImpression.id, positiveImpressionClusterIndex: fetcher.data.positiveImpressionClusterIndex})
    }
  }, [fetcher.data])

  // Key-Press Control
  useKeyPress(keys, event=>{
    if(params.paperId){
      if(event.key === "ArrowRight"){
        positiveSubmitRef.current.click()
      }

      else if(event.key === "ArrowLeft"){
        negativeSubmitRef.current.click()
      }

      else if(event.key === 'p' || event.key === 'P'){
        pinCurrentPaper(props.setTraversalPath)
      }
      else if(event.key === 'r' || event.key === "R"){
        window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank")
      }
    }
  })


  //TODO: refactor reading list form to use fetchers and add errors
  return (
    <div className="control-panel flex-column">
      <div className="panel" onClick={() => setToggle(!toggle)} style = {{cursor: "pointer"}}>
        <img src={glyph} alt="Glyph Logo" className="paper-portrait"/>
        <div className="metadata-grid" style = {{display: toggle? "none" : "grid"}}>
          <div className="metadata-bit">
            <p className="tl">{props.metadata ? props.metadata.citationCount : ""}</p>
            <small>Citations</small>
          </div>
          <div className="metadata-bit">
          <p className="tr">{props.metadata ? props.metadata.referenceCount : ""}</p>
            <small>References</small>
          </div>
          <div className="metadata-bit">
          <p className="bl">{props.metadata ? props.metadata.influentialCitationCount : ""}</p>
            <small>Influential</small>
          </div>
          
          
        </div>
      </div>

      <div className="panel flex-column">
        <Form method="post" className="switch-wrapper">
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)}/>
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)}/>
          <input type="hidden" name="algParams" value={JSON.stringify(props.algParams)} />
          <input type="hidden" name="negativeDOI" value={negativeDOI ? JSON.stringify(negativeDOI) : ""} />
          <input type="hidden" name="positiveDOI" value={positiveDOI ? JSON.stringify(positiveDOI) : ""} />
          <input type="hidden" name="clusters" value={JSON.stringify(props.clusters)} />

          <div className="switch flex-row" style={{ gap: "0px" }}>
            <button
              name="impression"
              type={params.paperId ? "submit" : "button"}
              value="false"
              className="impression-button"
              ref={negativeSubmitRef}
            >
              <div className="circle left" />
            </button>
            <button
              name="impression"
              type={params.paperId ? "submit" : "button"}
              value="true"
              className="impression-button"
              ref={positiveSubmitRef}
            >
              <div className="circle right" />
            </button>
          </div>
        </Form>
        <div className="button-wrapper flex-row">
          <div className="button-column flex-column">
            <div className="button">
              <img className="anchor" src={pin} alt="Read Logo" />
              <div className="key" onClick={() => params.paperId ? pinCurrentPaper(props.setTraversalPath) : {}}>
                <div className="key-cap">
                  P
                </div>
                <div className="key-caption">
                  Pin
                </div>
              </div>
            </div>
            <div className="button">

              <img className="anchor" src={read} alt="Read Logo" />

              <div className="key" onClick={() => params.paperId ? window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank") : {}}>
                <div className="key-cap">
                  R
                </div>
                <div className="key-caption">
                  Read
                </div>
              </div>
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
