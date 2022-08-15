import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link, useParams, Form, useSubmit } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"

import Tree from 'react-d3-tree'

import { useCenteredTree } from "~/utils/tree-visualisation"

import NoSSR from 'react-no-ssr-depup';

import { traversalNode } from "~/components/PathTraversal/traversal-node"


export function TraversalViewer(props) {
  const [nodeState, setNodeState] = useState("")
  const [visibleNodeTitle, setVisibleNodeTitle] = useState(null)
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState();
  const containerRef = useRef();
  const params = useParams();

  useEffect(() => {
    setNodeState(props.nodeState)
  }, [props.nodeState])

  useEffect(() => {
    // console.log("CONTAINER REF:", containerRef.current)
    if (containerRef.current !== undefined) {
      // let el = containerRef.current.getElementsByClassName("rd3t-g")
      // console.log("IMPORTANT!:", el)
      // console.log("EL 0", el[0])
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width/2, y: height/2});
    }
  }, [containerRef.current])

  return (
    <div className={props.horizontal ? "horizontal-traversal-viewer traversal-viewer" : "traversal-viewer"} ref={containerRef}>
      {params.paperId &&
        <NoSSR>
          <Tree
            depthFactor={300}
            collapsible={false}
            dimensions={dimensions}
            translate={translate}
            zoomable={true}
            data={props.traversalPath}
            // onUpdate={(target)=> setTranslate(target.translate)}
            renderCustomNodeElement={(rd3tProps) =>
              traversalNode({ ...rd3tProps, nodeState, visibleNodeTitle, setVisibleNodeTitle})}
            styles={{
              links: {
                stroke: 'red',
                strokeWidth: "1px",
              },
            }}
          />
        </NoSSR>
      }
    </div>

  )
}
