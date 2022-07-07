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

// TREE UPDATE:
  // When you click on a node, update the most recently visited node to that node
  // Also redirect to that DOI's endpoint

  // The tree update logic should then automatically give the tree a branching structure

  // Use the "mostRecentlyVisitedNode" id to define the active node

  // Build in translate logic that automatically focuses the graph onto the most recently visited node

  // We probably need an internal id for each node -- this needs to count upwards with local storage so that it persists alongside the tree
    // Change the tree search so that it uses the id rather than the DOI to find this
    // This will definitely be required if we only guarantee that the same paper won't show up in the same path twice, which makes a lot of intuitive sense to me

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
        translate={translate}
        zoomable={false}
        renderCustomNodeElement={traversalNode}
       />
    </div>
  )
}
