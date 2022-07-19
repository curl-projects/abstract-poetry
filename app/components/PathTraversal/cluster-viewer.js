import NoSSR from 'react-no-ssr-depup';
import loadable from '@loadable/component'
import { useRef, useState, useEffect, useMemo } from "react";
import * as localforage from "localforage";
import { useParams } from "@remix-run/react";
import { clusterNode } from "~/components/PathTraversal/cluster-node"

export function ClusterViewer(props){
  const ForceGraph2D = loadable(() => import('./forceGraph'))
  const containerRef = useRef();
  const fgRef = useRef();
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const params = useParams();

  useEffect(() => {
    setWidth(containerRef.current.clientWidth)
    setHeight(containerRef.current.clientHeight)
  }, [containerRef.current])


  // useEffect(async()=>{
  //   const forceNodeData = await localforage.getItem("forceNodes")
  //   if(forceNodeData !== props.forceNodes){
  //     console.log("HELLO")
  //     setForceNodes(forceNodeData)
  //   }
  // }, [props.forceNodes])

  // useEffect(()=>{
  //     console.log("PROPS_FORCE_NODES", props.forceNodes)
  // }, [props.forceNodes])
  //
  // useEffect(()=>{
  //     console.log("MEMOIZED_FORCE_NODES", memoizedForceNodes)
  // }, [memoizedForceNodes])

  const handleEngineStop = () => {
    fgRef.current.pauseAnimation = true
  }

  return(

    <div className="traversal-viewer" ref={containerRef}>
      <NoSSR>
        <ForceGraph2D
          graphData={props.forceNodes ? props.forceNodes : {nodes: [], links: []}}
          ref={fgRef}
          forceEngine="d3"
          // d3AlphaMin={0}
          d3AlphaDecay={0.1}
          width={width}
          height={height}
          onEngineStop={handleEngineStop}
        />
      </NoSSR>
    </div>
  )}
