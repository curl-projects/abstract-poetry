import React from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"


export const traversalNode = ({ nodeDatum, nodeState }) => (
  <React.Fragment>
    <g>
    <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}?nodeId=${nodeDatum.attributes.nodeId}` : ""}>
    <circle
      r={15}
      fill={ nodeState === nodeDatum.attributes?.nodeId ? "#FFFFFF" : "#CCCCCC"}
      stroke ={nodeDatum.attributes?.pinned ? "green" : (nodeState === nodeDatum.attributes?.nodeId) ? "red" : "#3724E5"}
      >
      </circle>
      <text className="node-text">
        {false? nodeDatum.name : ""}
      </text>
    </Link>
    </g>
  </React.Fragment>
);
