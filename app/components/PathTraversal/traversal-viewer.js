import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link, useParams, Form, useSubmit } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"
import Tree from 'react-d3-tree'
import { useCenteredTree } from "~/utils/tree-visualisation"
import { checkIfActiveNode } from "~/utils/visited-papers"
import * as localforage from "localforage";
import NoSSR from 'react-no-ssr-depup';


const traversalNode = ({ nodeDatum, nodeState }) => (
  <React.Fragment>
    <g>
    <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}?nodeId=${nodeDatum.attributes.nodeId}` : ""}>
    <circle
      r={15}
      onClick={() => {
        localforage.setItem("activeNodeId", nodeDatum.attributes?.nodeId)
      }}
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
  const [nodeState, setNodeState] = useState("hello")
  const submit = useSubmit();

  useEffect(()=>{
    setNodeState(props.nodeState)
  }, [props.nodeState])


  return(
    <div className="TraversalViewer" ref={containerRef} style={{
        flex: 1,
        width: "90%",
        border: '2px dashed pink',
        display: 'flex',
      }}>
      <NoSSR>
        <Tree
          depthFactor={300}
          collapsible={false}
          dimensions={dimensions}
          translate={translate}
          zoomable={false}
          data={props.traversalPath}
          renderCustomNodeElement={(rd3tProps) =>
            traversalNode({ ...rd3tProps, nodeState})}
         />
      </NoSSR>
    </div>
  )
}
//
// <foreignObject width={300} height={300} y={-15} x={-15} style={{cursor: "grab"}}>
//   <Link to={nodeDatum.attributes ? `/${slugifyDoi(nodeDatum.attributes.doi)}` : ""}>
//     <button style={{ width: "30px",
//                   cursor: "pointer",
//                   height: '30px',
//                   borderRadius: "100px",
//                   border: '2px solid black',
//                   backgroundColor: nodeDatum.attributes?.pinned ? "blue" : (nodeState === nodeDatum.attributes?.nodeId) ? "red" : "green"
//                 }}>
//     </button>
//   </Link>
//     <div>
//       <p style={{whiteSpace: "nowrap", overflow: "auto"}}>{nodeDatum.name}</p>
//     </div>
// </foreignObject>
//
