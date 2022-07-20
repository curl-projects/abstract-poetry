import NoSSR from 'react-no-ssr-depup';
import loadable from '@loadable/component'
import { useRef, useState, useEffect, useMemo } from "react";
import * as localforage from "localforage";
import { useParams } from "@remix-run/react";
import { clusterNode } from "~/components/PathTraversal/cluster-node"

import ForceGraph2D from "./forceGraph.client"


export function ClusterViewer(props) {

  const containerRef = useRef();
  const fgRef = useRef();
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const params = useParams();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

  useEffect(() => {
    setWidth(containerRef.current.clientWidth)
    setHeight(containerRef.current.clientHeight)
  }, [containerRef.current])

  useEffect(() => {
    const forceNodeData = JSON.parse(localStorage.getItem("forceNodes"));
    setGraphData(forceNodeData)
  }, [props.forceNodes])

  return (

    <div className="traversal-viewer" ref={containerRef}>
      {(typeof window !== "undefined") &&
        <ForceGraph2D
          graphData={props.forceNodes ? graphData : { nodes: [], links: [] }}
          ref={fgRef}
          forceEngine="d3"
          // d3AlphaMin={0}
          d3AlphaDecay={0.1}
          width={width}
          height={height}
          cooldownTicks={20}
          onEngineStop={() => fgRef.current.zoomToFit(1800)}
        />
      }
    </div>
  )
}
