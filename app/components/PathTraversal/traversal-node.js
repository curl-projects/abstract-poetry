import React from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"


export const traversalNode = ({ nodeDatum, nodeState }) => (
  <React.Fragment>
    <g>
    <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}?nodeId=${nodeDatum.attributes.nodeId}` : ""}>
    <circle
      r={15}
      fill={nodeDatum.attributes?.pinned ? "blue" : (nodeState === nodeDatum.attributes?.nodeId) ? "red" : "green"}
      >
      </circle>
      <text>
        {nodeDatum.name}
      </text>
    </Link>
    </g>
  </React.Fragment>
);
