import focus from "../../../public/assets/focus.svg";
import network from "../../../public/assets/network.svg";
import branches from "../../../public/assets/branches.svg";
import { Share } from "~/components/PathTraversal/traversal-export"
import { Tooltip } from "@mui/material";

export function Background(props) {

  return (
    <>
      <div className={props.horizontal ? "background horizontal-left" : "background"}>
        <div className='background-img' />
      </div>
      <div className={props.horizontal ? "background-panel-left horizontal-control-panel" : "background-panel-left"} />
      <div className={props.horizontal ? "background-panel-right horizontal" : "background-panel-right"} />
    </>
  )
}


export function Controls(props) {
  return (
    <>
      <div className={props.horizontal ? "horizontal-traversal-controls" : "traversal-controls flex-row"}>
        <div className={props.horizontal ? "abs-right toolbar horizontal-toolbar panel-glass flex-row" : "abs-right toolbar panel-glass flex-row"} style={{ pointerEvents: 'auto', flexDirection: "row-reverse" }}>
          <Tooltip title={props.traversalState ? "Show Path View" : "Show Cluster View"}>
            <img src={props.traversalState ? branches : network} style={{ cursor: 'pointer', height: "100%" }} alt="Focus on a specific paper" onClick={() => props.setTraversalState(prevState => !prevState)} />
          </Tooltip>
        </div>
        <Share
          horizontal={props.horizontal}
          traversalPath={props.traversalPath}
        />
        {props.user &&
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form action="/logout" method="post">
                <input type='hidden' name="url" value={url} />
                <Tooltip title="Logout">
                  <button type="submit" className="save-button" style={{ width: "100%", height: "100%" }}>
                    <img src={logout} alt="Logout" />
                  </button>
                </Tooltip>
              </Form>
            </div>
            <div>
              {props.pathId &&
                <Tooltip title="Share Search">
                  <button onClick={() => props.setShareModalOpen(true)}
                    className="save-button">
                    <img src={sharePath} alt="Share Search" />
                  </button>
                </Tooltip>
              }
              {!props.pathId &&
                <Tooltip title="Save your search first to share it">
                  <button className="save-button">
                    <img src={sharePath} alt="Share Search" />
                  </button>
                </Tooltip>
              }
            </div>
            <div>
              <Tooltip title="Save Search Session">
                <button onClick={() => props.setSaveModalOpen(true)}
                  className="save-button">
                  <img src={save} alt="Save Button" />
                </button>
              </Tooltip>
            </div>
            <Tooltip title="Find Saved Session">
              <button onClick={() => setModalOpen(true)}>
                <img src={path} className="account-button" fill='666666' alt="Account Button" />
              </button>
            </Tooltip>
          </>
        }
      </div>
    </>
  )
}
