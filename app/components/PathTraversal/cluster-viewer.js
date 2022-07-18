import NoSSR from 'react-no-ssr-depup';
import loadable from '@loadable/component'
import { useRef, useState, useEffect } from "react";

export function ClusterViewer(props){
  const ForceGraph2D = loadable(() => import('./forceGraph'))
  const containerRef = useRef();
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(containerRef.current.clientWidth)
    setHeight(containerRef.current.clientHeight)
  }, [containerRef.current])

  const tempNodeData = [
    {
          "id": "id1",
          "name": "name1",
          "val": 1
        },
        {
          "id": "id2",
          "name": "name2",
          "val": 10
        }
  ]

  const tempLinkData = [
    {
      "source": "id1",
      "target": "id2"
    }
  ]

  const graphData = {
    nodes: tempNodeData,
    links: tempLinkData
  }


  return(
    <div className="traversal-viewer" ref={containerRef}>
    <NoSSR>
      <ForceGraph2D
        graphData={props.forceNodes ? props.forceNodes : {nodes: [], links: []}}
        // backgroundColor="grey"
        width={width}
        height={height}
      />
    </NoSSR>
    </div>
  )}
