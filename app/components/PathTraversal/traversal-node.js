import React from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"

export const traversalNode = ({ nodeDatum, nodeState }) => (
  <React.Fragment>
    <g>
    <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}?nodeId=${nodeDatum.attributes.nodeId}` : ""}>
    <circle
      r={15}
      fill={ nodeState === nodeDatum.attributes?.nodeId ? "rgb(18, 18, 18)" : "rgb(200, 200, 200)"}
      stroke = {nodeDatum.attributes?.pinned ? "rgb(187, 160, 247)" : (nodeState === nodeDatum.attributes?.nodeId) ? "rgb(48, 85, 185)" : "rgb(243, 243, 243)"}
      >
      </circle>
      <text className="node-text">
        {false? nodeDatum.name : ""}
      </text>
    </Link>
    </g>
  </React.Fragment>
);
