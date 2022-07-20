import NoSSR from 'react-no-ssr-depup';
import loadable from '@loadable/component'
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as localforage from "localforage";
import { useParams, useSubmit, Form } from "@remix-run/react";
import { clusterNode } from "~/components/PathTraversal/cluster-node"
import { slugifyDoi } from "~/utils/doi-manipulation";
import ForceGraph2D from "./forceGraph.client"


export function ClusterViewer(props) {

  const containerRef = useRef();
  const formRef = useRef();
  const fgRef = useRef();
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const params = useParams();
  const submit = useSubmit();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

  useEffect(() => {
    setWidth(containerRef.current.clientWidth)
    setHeight(containerRef.current.clientHeight)
  }, [containerRef.current])


  useEffect(async() => {
    const forceNodeData = JSON.parse(await localStorage.getItem("forceNodes"));
    setGraphData(forceNodeData)
  }, [props.forceNodes])

  function setNodeColors(node){
      if(node.pinned){
        console.log("NODE.PINNED", node.pinned)
        return 'blue'
      }
      else if(node.nodeId === props.nodeState){
        return 'rgb(21, 18, 26)'
      }
      else if(node.type === 'cluster')
        return "rgba(183, 176, 183, 0.7)"
      else {
        return 'rgba(90, 90, 90, 0.7)'
      }
  }

  const resolveNodeLabel = useCallback(node => {
    if(node.title){
      return node.title
    }
    else{
      return node.name
    }
  }, [fgRef])

  function handleRedirectSubmit(node){
    if(node.type === 'paper'){
      const formData = new FormData(formRef.current)
      formData.set("redirectString", `/${slugifyDoi(node.doi)}?nodeId=${node.nodeId}`)
      submit(
          formData,
          { method: "post", action: "/redirect-cluster-node" }
        );
    }
    else if(node.type === 'cluster'){

    }
  }

  return (
    <div className="traversal-viewer" ref={containerRef}>
      <Form ref={formRef} method="post" onSubmit={handleRedirectSubmit}>

      </Form>
      {(typeof window !== "undefined") &&
        <ForceGraph2D
          graphData={props.forceNodes ? graphData : { nodes: [], links: [] }}
          ref={fgRef}
          forceEngine="d3"
          // d3AlphaMin={0}
          d3AlphaDecay={0.1}
          width={width}
          height={height}
          cooldownTicks={10}
          onEngineStop={() => fgRef.current.zoomToFit(1800)}
          nodeColor={setNodeColors}
          onNodeClick={handleRedirectSubmit}
          nodeLabel={resolveNodeLabel}
        />
      }
    </div>
  )
}
