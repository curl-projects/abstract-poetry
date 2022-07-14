import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link, useParams, Form, useSubmit } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"

import Tree from 'react-d3-tree'

import { useCenteredTree } from "~/utils/tree-visualisation"
import { checkIfActiveNode } from "~/utils/visited-papers"

import * as localforage from "localforage";
import NoSSR from 'react-no-ssr-depup';

import { traversalNode } from "~/components/PathTraversal/traversal-node"


export function TraversalViewer(props) {
  const [dimensions, translate, containerRef] = useCenteredTree();
  const [nodeState, setNodeState] = useState("")

  useEffect(() => {
    setNodeState(props.nodeState)
    console.log(translate)
  }, [props.nodeState])


  return (
    <div className="traversal-viewer" ref={containerRef}>
      <NoSSR>
        <Tree
          depthFactor={300}
          collapsible={false}
          dimensions={dimensions}
          translate={translate}
          zoomable={true}
          data={props.traversalPath}
          renderCustomNodeElement={(rd3tProps) =>
            traversalNode({ ...rd3tProps, nodeState })}
          styles={{
            links: {

              stroke: 'red',
              strokeWidth: "1px",
            },
          }}
        />
      </NoSSR>
    </div>

  )
}
