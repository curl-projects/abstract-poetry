import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"
import Tree from 'react-d3-tree'
import { useCenteredTree } from "~/utils/tree-visualisation"

const traversalNode = ({ nodeDatum }) => (
  <React.Fragment>
    <g>
    <circle
      r={15}
      onClick={evt => {
        toggleNode();
        onNodeClick(evt);
      }}
      // onMouseOver={onNodeMouseOver}
      // onMouseOut={onNodeMouseOut}
    ></circle>
      <text>
        {nodeDatum.name}
      </text>
    </g>
  </React.Fragment>
);


export function TraversalViewer(props){
  const [dimensions, translate, containerRef] = useCenteredTree();

  useEffect(()=>{
    console.log("PROPS TRAVERSAL_VIEWER:", props.traversalPath)
  }, [props.traversalPath])

  return(
    <div className="TraversalViewer" ref={containerRef} style={{
        flex: 1,
        width: "90%",
        border: '2px dashed pink',
        display: 'flex',
      }}>
      <Tree
        data={props.traversalPath}
        depthFactor={300}
        collapsible={false}
        dimensions={dimensions}
        // translate={translate}
        zoomable={false}
        // renderCustomNodeElement={traversalNode}
       />
    </div>
  )
}
