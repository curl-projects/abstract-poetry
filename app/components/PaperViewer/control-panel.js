import { Form, useParams, useFetcher, Link } from "@remix-run/react";
import { useRef, useState, useEffect } from "react"
import { deslugifyDoi, slugifyDoi } from "~/utils/doi-manipulation";
import { pinCurrentPaper } from "~/utils/visited-papers"
import useKeyPress from "react-use-keypress";
import * as localforage from "localforage";

import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";

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

  const [pinState, setPinState] = useState(null)

  const [toggle, setToggle] = useState(true)

  // // ANDRE: EAGER LOADING
   useEffect(async()=>{
     if(params.paperId){
       if((Object.keys(props.traversalPath).length !== 0) && (typeof props.mostRecentNode === "number") && props.algParams && props.clusters && Object.keys(props.clusters).includes(deslugifyDoi(params.paperId))){
         fetcher.submit({doi: deslugifyDoi(params.paperId),
                         traversalPath: JSON.stringify(props.traversalPath),
                         mostRecentNode: JSON.stringify(props.mostRecentNode),
                         algParams: JSON.stringify(props.algParams),
                         clusters: JSON.stringify(props.clusters)
                       },
                         {method: "post", action: '/preload-impressions'})
       }
       setToggle(false)
     }
   }, [props.traversalPath, props.mostRecentNode, props.algParams, props.clusters])

  useEffect(()=>{
    console.log("FETCHER DATA:", fetcher.data)
  }, [fetcher.data])

  useEffect(()=>{
    console.log("CLUSTER PROP SIZE:", props.clusters ? Object.keys(props.clusters).length : 0, props.clusters)
  }, [props.clusters])

  useEffect(()=>{
    // Saves prefetched doi's into state
    if(fetcher.data?.negativeImpression && fetcher.data.positiveImpression){
        setNegativeDOI({negativeImpressionDOI: fetcher.data.negativeImpression.id, negativeImpressionClusterIndex: fetcher.data.negativeImpressionClusterIndex})
        setPositiveDOI({positiveImpressionDOI: fetcher.data.positiveImpression.id, positiveImpressionClusterIndex: fetcher.data.positiveImpressionClusterIndex})
    }
  }, [fetcher.data])

  // Key-Press Control
  useKeyPress(keys, event => {
    if (params.paperId) {
      if (event.key === "ArrowRight") {
        positiveSubmitRef.current.click()
      }

      else if (event.key === "ArrowLeft") {
        negativeSubmitRef.current.click()
      }

      else if (event.key === 'p' || event.key === 'P') {
        pinCurrentPaper(props.setTraversalPath, props.setForceNodes, setPinState)
      }
      else if (event.key === 'r' || event.key === "R") {
        window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, '_blank', 'noopener,noreferrer')
      }
    }
  })




  //TODO: refactor reading list form to use fetchers and add errors
  return (
    <div className="control-panel flex-column">
      <div className="panel">
        <img src={glyph} alt="Glyph Logo" className="paper-portrait" />
        <div className="metadata-grid" style={{ display: toggle ? "none" : "grid" }}>
          <div className="metadata-bit">
            <p className="tr">{props.metadata ? props.metadata.citationCount : ""}</p>
            <small>Citations</small>
          </div>
          <div className="metadata-bit">
            <p className="tl">{props.metadata ? props.metadata.referenceCount : ""}</p>
            <small>References</small>
          </div>
          <div className="metadata-bit">
            <p className="br">{props.metadata ? props.metadata.influentialCitationCount : ""}</p>
            <small>Influential citation{props.metadata ? props.metadata.influentialCitationCount === 1 ? "": "s" : ""}</small>
          </div>


        </div>
      </div>

      <div className="panel flex-column">
        <Form method="post" className="switch-wrapper">
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)} />
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)} />
          <input type="hidden" name="algParams" value={JSON.stringify(props.algParams)} />
          <input type="hidden" name="negativeDOI" value={negativeDOI ? JSON.stringify(negativeDOI) : ""} />
          <input type="hidden" name="positiveDOI" value={positiveDOI ? JSON.stringify(positiveDOI) : ""} />
          <input type="hidden" name="clusters" value={JSON.stringify(props.clusters)} />

          <div className="switch flex-row" style={{ gap: "0px" }}>
            <Tooltip title="Fewer Papers Like This (←)">
              <button
                name="impression"
                type={params.paperId ? "submit" : "button"}
                value="false"
                className="impression-button"
                ref={negativeSubmitRef}
              >
                <div className="circle left" />
              </button>
            </Tooltip>
            <Tooltip title="More Papers Like This (→)">
              <button
                name="impression"
                type={params.paperId ? "submit" : "button"}
                value="true"
                className="impression-button"
                ref={positiveSubmitRef}
              >
                <div className="circle right" />
              </button>
            </Tooltip>
          </div>
        </Form>
        <div className="button-wrapper flex-row">
          <div className="button-column flex-column">
            <div className="button">
              <img className="anchor" src={pin} alt="Read Logo" />
              <Tooltip title="Pin to your Reading List (P)">
                <div className="key" onClick={() => params.paperId ? pinCurrentPaper(props.setTraversalPath, props.setForceNodes, setPinState) : {}}>
                  <div className="key-cap">
                    P
                  </div>
                  <div className="key-caption">
                    Pin
                  </div>
                </div>
              </Tooltip>
            </div>
            <div className="button">

              <img className="anchor" src={read} alt="Read Logo" />
              <Tooltip title="Read in PLOS (R)">
                <div className="key" onClick={() => params.paperId ? window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, '_blank', 'noopener,noreferrer') : {}}>
                  <div className="key-cap">
                    R
                  </div>
                  <div className="key-caption">
                    Read
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>

          <Tooltip title = "Highlight Keywords. Coming Soon.">
            <div className="pin">
              <div className="effect-1" />
              <div className="toggle">
                <div className="eye" />
              </div>
              <button onClick={() => pinCurrentPaper(props.setTraversalPath, props.setForceNodes, setPinState)}></button>
            </div>
          </Tooltip>
        </div>
      </div>
      <Snackbar
        open={pinState !== null}
        autoHideDuration={2000}
        message={pinState ? "Paper Pinned" : "Paper Unpinned"}
        onClose={() => setPinState(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        style={{
          zIndex: 1000
        }}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              sx={{ p: 0.5 }}
              color="inherit"
              onClick={() => setPinState(null)}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}
