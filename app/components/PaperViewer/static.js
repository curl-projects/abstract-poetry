import focus from "../../../public/assets/focus.svg";
import network from "../../../public/assets/network.svg";
import branches from "../../../public/assets/branches.svg";
import { Share } from "~/components/PathTraversal/traversal-export"
import { Tooltip } from "@mui/material";


import { Form, useParams, useFetcher, Link } from "@remix-run/react";

export function Background(props) {

  return (
    <>
      <div className={props.horizontal ? "background horizontal-left" : "background"}>
        <div className='background-img' />
      </div>
      <div className={props.horizontal ? "background-panel-left horizontal-control-panel" : "background-panel-left"} />
      <div className={props.horizontal ? "background-panel-right horizontal" : "background-panel-right"} />
    </>
  )
}


export function Controls(props) {
  return (
    <>
      <div className={props.horizontal ? "horizontal-traversal-controls" : "traversal-controls flex-row"}>
        <div className={props.horizontal ? "abs-right toolbar horizontal-toolbar panel-glass flex-row" : "abs-right toolbar panel-glass flex-row"} style={{ pointerEvents: 'auto', flexDirection: "row-reverse" }}>
          <Tooltip title={props.traversalState ? "Show Path View" : "Show Cluster View"}>
            <img src={props.traversalState ? branches : network} style={{ cursor: 'pointer', height: "100%" }} alt="Focus on a specific paper" onClick={() => props.setTraversalState(prevState => !prevState)} />
          </Tooltip>
        </div>
      </div>
      <div className="traversal-share">
      <Share
          horizontal={props.horizontal}
          traversalPath={props.traversalPath}
        />
      </div>
    </>
  )
}
