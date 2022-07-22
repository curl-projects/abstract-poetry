import React from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"

export const traversalNode = ({ nodeDatum, nodeState, visibleNodeTitle, setVisibleNodeTitle }) => (
  <React.Fragment>
    <g>
    <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}?nodeId=${nodeDatum.attributes.nodeId}` : ""}>
    <circle
      r={15}
      fill={nodeState === nodeDatum.attributes?.nodeId ? "rgb(18, 18, 18)" : "rgb(200, 200, 200)"}
      stroke = {nodeDatum.attributes?.pinned ? "rgb(187, 160, 247)" : (nodeState === nodeDatum.attributes?.nodeId) ? "rgb(48, 85, 185)" : "rgb(243, 243, 243)"}
      onMouseOver={()=>setVisibleNodeTitle(nodeDatum.attributes?.nodeId)}
      onMouseOut={()=>setVisibleNodeTitle(nodeDatum)}
      >
      </circle>
      <text x={(nodeDatum.attributes?.cluster && nodeDatum.attributes.cluster.toString().length === 2) ? -8 : -4}
            y={5}
            style={{ pointerEvents: 'none'}}
            stroke="rgb(48, 85, 185)"
            strokeWidth="2px">{ typeof nodeDatum.attributes.cluster === 'number' ? nodeDatum.attributes.cluster+1 : ""}</text>
    </Link>
    <text x={12} y={-16} strokeWidth="1px">
      {(visibleNodeTitle && visibleNodeTitle === nodeDatum.attributes.nodeId) ? nodeDatum.attributes.title : ""}
    </text>
    </g>
  </React.Fragment>
);

// <text className="node-text">
//   {nodeDatum.name ? nodeDatum.name : ""}
// </text>

// {nodeDatum.attributes?.cluster ? nodeDatum.attributes.cluster : ""}
