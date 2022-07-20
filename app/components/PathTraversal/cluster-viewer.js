import NoSSR from 'react-no-ssr-depup';
import loadable from '@loadable/component'
import { useRef, useState, useEffect, useMemo } from "react";
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
        return 'green'
      }
      else if(node.nodeId === props.nodeState){
        return 'red'
      }
      else if(node.type === 'cluster')
        return 'orange'
      else {
        return 'blue'
      }
  }

  function handleRedirectSubmit(node){
    if(node.type === 'paper'){
      const formData = new FormData(formRef.current)
      formData.set("redirectString", `/${slugifyDoi(node.doi)}?nodeId=${node.nodeId}`)
      submit(
          formData,
          { method: "post", action: "/redirect-cluster-node" }
        );
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

        />
      }
    </div>
  )
}
