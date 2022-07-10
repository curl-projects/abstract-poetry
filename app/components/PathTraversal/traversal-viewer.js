import React, { useEffect, useState } from "react"
import { useCenteredTree } from "~/utils/tree-visualisation"
import Tree from 'react-d3-tree'
import NoSSR from 'react-no-ssr-depup';
import { traversalNode } from "~/components/PathTraversal/traversal-node"

export function TraversalViewer(props){
  // TODO: dynamic tree centering whenever the active node changes

  const [dimensions, translate, containerRef] = useCenteredTree(); // automatically centers tree
  const [nodeState, setNodeState] = useState("")

  useEffect(()=>{
    // Irritating workaround because you can't use props in the traversalNode arrow function,
    // so the active node is read back into state
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
