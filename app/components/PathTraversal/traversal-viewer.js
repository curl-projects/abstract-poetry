import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link, useParams } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"
import Tree from 'react-d3-tree'
import { useCenteredTree } from "~/utils/tree-visualisation"
import { checkIfActiveNode } from "~/utils/visited-papers"

async function fillEval(event){
  console.log("EVENT:", event)
  // const activeNode = await checkIfActiveNode(id)
  // if(activeNode){
  //   return "red"
  // }
  // else{
  //   return "yellow"
  // }
  return "blue"
}

const traversalNode = ({ nodeDatum, nodeState }) => (
  <React.Fragment>
    <circle
      r={15}
      onClick={async evt => {
        console.log("NODE STATE:", nodeState)
      }}
      fill={nodeDatum.attributes?.pinned ? "blue" : (nodeState === nodeDatum.attributes?.nodeId) ? "red" : "green"}
      >
      </circle>
      <text>
        {nodeDatum.name}
      </text>
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

  useEffect(()=>{
    setNodeState(props.nodeState)
  }, [props.nodeState])

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
          renderCustomNodeElement={(rd3tProps) =>
            traversalNode({ ...rd3tProps, nodeState })}
         />
    </div>
  )
}
