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


  useEffect(async () => {
    const forceNodeData = JSON.parse(await localStorage.getItem("forceNodes"));
    setGraphData(forceNodeData)
    console.log(forceNodeData)
  }, [props.forceNodes])

  function setNodeColors(node) {
    if (node.pinned) {
      console.log("NODE.PINNED", node.pinned)
      return 'rgb(178, 171, 243)'
    }
    else if (node.nodeId === props.nodeState) {
      return 'rgb(21, 18, 26)'
    }
    else if (node.type === 'cluster')
      return 'rgb(250,250,250)'
    else {
      return 'rgba(90, 90, 90, 0.7)'
    }
  }

  function setLinkColors(link) {
    return 'rgb(243,243,243)'
  }


  const resolveNodeLabel = useCallback(node => {
    if (node.title) {
      return node.title
    }
    else {
      return node.name
    }
  }, [fgRef])

  function handleRedirectSubmit(node) {
    if (node.type === 'paper') {
      const formData = new FormData(formRef.current)
      formData.set("redirectString", `/${slugifyDoi(node.doi)}?nodeId=${node.nodeId}`)
      submit(
        formData,
        { method: "post", action: "/redirect-cluster-node" }
      );
    }
    else if (node.type === 'cluster') {

    }
  }

  const getColor = (node) => {

    if (node.pinned) {
      return 'rgb(178, 171, 243)'

    } else if (node.type === 'paper') {
      if (node.nodeId === props.nodeState) {
        return 'rgb(21, 18, 26)'
      }
      return 'rgb(238, 238, 238)'
    }
    else if (node.type === 'cluster') {
      return 'rgb(243,243,243)'
    }
  }

  const nodePaint = (node, color, ctx) => {

    if (node.type === "cluster") {
      ctx.fillStyle = 'rgb(255,255,255)';
    } else if (node.pinned) {
      ctx.fillStyle = 'rgb(238, 238, 238)';
    } else if (node.nodeId === props.nodeState) {
      return 'rgb(100, 100, 100)'
    } else {
      ctx.fillStyle = 'rgb(200, 200, 200)';
    }

    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }


  return (
    <div className="traversal-viewer" ref={containerRef}>
      <Form ref={formRef} method="post" onSubmit={handleRedirectSubmit} />

      {(typeof window !== "undefined") &&
        <ForceGraph2D
          graphData={props.forceNodes ? graphData : { nodes: [], links: [] }}
          ref={fgRef}
          forceEngine="d3"
          d3AlphaMin={0.1}
          d3AlphaDecay={0.02}
          width={width}
          height={height}
          cooldownTicks={10000}
          onEngineStop={() => fgRef.current.zoomToFit(400)}

          nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node), ctx)}

          onNodeClick={handleRedirectSubmit}
          nodeLabel={resolveNodeLabel}
          linkColor={setLinkColors}
        />
      }
    </div>
  )
}
