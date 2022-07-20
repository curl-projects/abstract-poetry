import React from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"


export const clusterNode = ({ nodeDatum, nodeState }) => (
    <g>
    <circle
      r={15}
      fill={"#CCCCCC"}
      stroke ={"#3724E5"}
      >
      </circle>
    </g>
);
