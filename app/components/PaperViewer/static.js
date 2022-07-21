import focus from "../../../public/assets/focus.svg";
import network from "../../../public/assets/network.svg";
import branches from "../../../public/assets/branches.svg";

import { Tooltip } from "@mui/material";

export function Background() {
  const backgroundImg = {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 1,
  }

  return (
    <>
      <div className="background">
        <div className='background-img' />
      </div>
      <div className="background-panel-left" />
      <div className="background-panel-right" />
    </>
  )
}


export function Controls({setTraversalState, traversalState}) {

  return (
    <>
      <div className="traversal-controls">
          <div className = "abs-right toolbar panel-glass flex-row" style = {{pointerEvents: 'auto', flexDirection: "row-reverse"}}>
              <Tooltip title = {traversalState? "Show Path View" : "Show Cluster View"}>
                <img src = {traversalState? branches : network} style={{cursor: 'pointer', height: "100%"}} alt ="Focus on a specific paper" onClick={() => setTraversalState(prevState => !prevState)} />
              </Tooltip>
          </div>
          <div className="join"/>
      </div>
    </>
  )
}
