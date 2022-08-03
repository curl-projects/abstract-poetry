import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import save from "../../../public/assets/save.svg";
import home from "../../../public/assets/home.svg";
import copy from "../../../public/assets/copy.svg";
import sharePath from "../../../public/assets/share-path.svg";
import logout from "../../../public/assets/logout.svg";
import { Form, useParams, Link, useFetcher, useSubmit } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { SocialsProvider } from "remix-auth-socials";
import Modal from '@mui/material/Modal';
import * as localforage from "localforage";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"
import journalIcon from "../../../public/assets/journal.svg"
import calendar from "../../../public/assets/calendar.svg";
import path from "../../../public/assets/path-search.svg";
import { Tooltip } from "@mui/material";

export function Header(props) {
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false)
  const [url, setUrl] = useState('/')
  const savePathFetcher = useFetcher();
  const readPathFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const submit = useSubmit();
  const [pathName, setPathName] = useState("")
  const [showCopied, setShowCopied] = useState(false)
  const shareRef = useRef();

  useEffect(() => {
    if(window){
      setUrl(window.location.pathname)
    }
  }, [])


  function handleSaveClick(){
    savePathFetcher.submit({
      activeNodeId: props.activeNodeId,
      algParams: JSON.stringify(props.algParams), // otherwise it gets rid of the nested list structure
      clusters: JSON.stringify(props.clusters),
      forceNodes: JSON.stringify(props.forceNodes),
      nodeIdCounter: JSON.stringify(props.nodeIdCounter),
      searchString: JSON.stringify(props.searchString),
      traversalPath: JSON.stringify(props.traversalPath),
      pathId: props.pathId,
      pathName: pathName,
    }, {
      method: "post",
      action: "/save-path"
    })
    localforage.setItem("pathName", pathName)
    props.setExistingPathName(pathName)
  }

  function handlePathInit(path){
    console.log("PATH:", path)
    localforage.setItem("activeNodeId", parseInt(path.activeNodeId))
    localforage.setItem("algParams", JSON.parse(path.algParams))
    localforage.setItem("clusters", JSON.parse(path.clusters))
    localforage.setItem("forceNodes", JSON.parse(path.forceNodes))
    localforage.setItem("nodeIdCounter", parseInt(path.nodeIdCounter))
    localforage.setItem("pathId", path.pathId)
    localforage.setItem("searchString", JSON.parse(path.searchString))
    localforage.setItem("traversalPath", JSON.parse(path.traversalPath))
    localforage.setItem("pathName", path.pathName)

    const tree = new TreeModel();
    const root = tree.parse(JSON.parse(path.traversalPath))

    const mostRecentNode = root.first(function(node){
      return node.model.attributes.nodeId === parseInt(path.activeNodeId)
    })
    console.log("MOST RECENT NODE:", mostRecentNode)
    const redirectURL = slugifyDoi(mostRecentNode.model.attributes.doi) || ''
    redirectFetcher.submit({redirectURL: `${redirectURL}?isPathRedirect=true`}, {
      method: "post",
      action: "/redirect-paths"
    })
  }

  useEffect(()=>{
    console.log("MODAL OPEN?? ", modalOpen)
    if(modalOpen){
      readPathFetcher.submit({
      }, {
        method: "get",
        action: "/get-paths"
      })
    }
  }, [modalOpen])

  useEffect(()=>{
    console.log("SAVE PATH FETCHER DATA:", savePathFetcher.data)
  }, [savePathFetcher])

  useEffect(()=>{
    if(savePathFetcher.data){
        localforage.setItem('pathId', savePathFetcher.data.pathId)
        props.setPathId(savePathFetcher.data.pathId)
    }
  }, [savePathFetcher])

  if (params.paperId) {
    return (
      <>
        <div className="header-wrapper">
          <div className="user-control-wrapper">
            {props.user &&
              <>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <Form action="/logout" method="post">
                      <input type='hidden' name="url" value={url}/>
                      <Tooltip title="Logout">
                        <button type="submit" className="save-button" style={{width: "100%", height: "100%"}}>
                          <img src={logout} alt="Logout"/>
                        </button>
                      </Tooltip>
                    </Form>
                  </div>
                  <div>
                    {props.pathId &&
                    <Tooltip title="Share Search">
                      <button onClick={()=>props.setShareModalOpen(true)}
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
                      <button onClick={()=>props.setSaveModalOpen(true)}
                              className="save-button">
                        <img src={save} alt="Save Button" />
                      </button>
                    </Tooltip>
                  </div>
              <Tooltip title="Find Saved Session">
                <button onClick={()=>setModalOpen(true)}>
                    <img src={path} className="account-button" fill='666666' alt="Account Button" />
                </button>
              </Tooltip>
              </>
            }
            {!props.user &&
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${url}`}
                >
                <Tooltip title="Login">
                  <button type='submit'>
                      <img src={account} className="account-button" fill='666666' alt="Account Button" />
                  </button>
                </Tooltip>
              </Form>
            }
          </div>
        </div>
        <div className="header">
          <div className="search flex-space-between">
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <label className="search-input-label">Searching semantic regions associated with</label>
              <input type="text" disabled="disabled" name="searchString" placeholder={props.searchString ? props.searchString : "abstract poetry"} />
            </div>
            <Link to="/search">
              <Tooltip title="Start New Search">
                <button type="submit" style={{ cursor: "pointer", paddingTop: '10px' }}>
                  <img src={home} alt="Home Logo" />
                </button>
              </Tooltip>
            </Link>
          </div>
          {false ? <img src={account} alt="Account Login" /> : null}
        </div>
        <Modal
          open={modalOpen}
          onClose={()=>setModalOpen(false)}
          >
          <div className="modal-box">
            {(readPathFetcher.state === "submitting" || readPathFetcher.state === "loading")
              ?
              <div className="modal-loading-box">
                <div className="wave-center-modal">
                  {[...Array(3)].map((e, i) => <div key={i} className="wave-modal"></div>)}
                </div>
              </div>
              :
              readPathFetcher.data?.traversalPaths.map((path, index) =>
                <div key={index} className="modal-path-box" onClick={()=>handlePathInit(path)}>
                    <div>
                      <h2 className="modal-path-box-pathname">{path.pathName}</h2>
                    </div>
                    <div className='path-metadata-box'>
                      <div className="flex-row shrink">
                        <div className="icon">
                          <img src={calendar} alt={"Created Date"} />
                        </div>
                        <small className="small">{new Date(path.createdTime).getDate()}/{new Date(path.createdTime).getMonth()}/{new Date(path.createdTime).getYear()}</small>
                      </div>
                      <div className="flex-row shrink">
                        <div className="icon">
                          <img src={journalIcon} alt={"Journal"} />
                        </div>
                        <small className="small">{JSON.parse(path.searchString)}</small>
                      </div>
                    </div>
                  <div className="path-metadata-box-separator"/>
                </div>
              )
            }
          </div>
        </Modal>
        <Modal
          open={props.saveModalOpen}
          onClose={()=>props.setSaveModalOpen(false)}
          >
          <div className="save-modal-box">
              <input type="text"
                     className="save-input"
                     autoFocus
                     onChange={(e)=>setPathName(e.target.value)}
                     placeholder={props.existingPathName ? props.existingPathName : "Give a name to your traversal path!"} />
                   {savePathFetcher.type === 'init' &&
              <button className="save-button" onClick={handleSaveClick}>
                <p className="save-button-text">Save Search</p>
              </button>
              }
              {(savePathFetcher.state === "submitting" || savePathFetcher.state === "loading") &&
                <p className="save-button-text">Saving...</p>
              }
              {savePathFetcher.type === 'done' &&
                <p className='save-button-text'>Saved!</p>
              }
          </div>
        </Modal>

        <Modal
          open={props.shareModalOpen}
          onClose={()=>props.setShareModalOpen(false)}
          >
          <div className="save-modal-box">
            <div className="share-wrapper">
              <p ref={shareRef}>{props.urlPrefix}{props.pathId}</p>
            <div className="share-copy-button" onClick={(e)=> {setShowCopied(true); navigator.clipboard.writeText(`${props.urlPrefix}${props.pathId}`)}}>
              <img src={copy} alt="Copy Link"></img>
            </div>
            </div>
            {showCopied &&
            <div>
              <p style={{color: "rgb(60, 60, 60, 0.8)"}}>Copied</p>
            </div>
            }
          </div>
        </Modal>
      </>
    )
  }
  else {
    return (
      <>
        <div className="header-wrapper">
          <div className="user-control-wrapper">
            {props?.user &&
              <>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <Form action="/logout" method="post">
                      <input type='hidden' name="url" value={url}/>
                      <Tooltip title="Logout">
                        <button type="submit" className="save-button" style={{width: "100%", height: "100%"}}>
                          <img src={logout} alt="Logout"/>
                        </button>
                      </Tooltip>
                    </Form>
                  </div>
              <Tooltip title="Find Saved Session">
                <button onClick={()=>setModalOpen(true)}>
                    <img src={path} className="account-button" fill='666666' alt="Account Button" />
                </button>
              </Tooltip>
              </>
            }
            {!props?.user &&
              <>
              <div className="user-text-wrapper">
                  <div>
                      <input type='hidden' name="url" value={url}/>
                      <button type="submit">
                        <p className="logout-text"></p>
                      </button>
                  </div>
              </div>
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${url}`}
                >
                <input type='hidden' name="url" value={url}/>
                <Tooltip title="Login">
                  <button type='submit'>
                      <img src={account} className="account-button" fill='666666' alt="Account Button" />
                  </button>
                </Tooltip>
              </Form>
              </>
            }
          </div>
        </div>
        <div className="header">
          <Form method="post" className="search flex-space-between">
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <input type="text" name="searchString" placeholder="Explore all of PLOS with keywords or DOIs" autoFocus />
            </div>
              <button type="submit" style={{ cursor: "pointer" }}>
                <img src={glass} alt="Glass Logo" />
              </button>
          </Form>
          {false ? <img src={account} alt="Account Login" /> : null}
        </div>
        <Modal
          open={modalOpen}
          onClose={()=>setModalOpen(false)}
          >
          <div className="modal-box">
            {(readPathFetcher.state === "submitting" || readPathFetcher.state === "loading")
              ?
              <div className="modal-loading-box">
                <div className="wave-center-modal">
                  {[...Array(3)].map((e, i) => <div key={i} className="wave-modal"></div>)}
                </div>
              </div>
              :
              readPathFetcher.data?.traversalPaths.map((path, index) =>
                <div key={index} className="modal-path-box" onClick={()=>handlePathInit(path)}>
                    <div>
                      <h2 className="modal-path-box-pathname">{path.pathName}</h2>
                    </div>
                    <div className='path-metadata-box'>
                      <div className="flex-row shrink">
                        <div className="icon">
                          <img src={calendar} alt={"Created Date"} />
                        </div>
                        <small className="small">{new Date(path.createdTime).getDate()}/{new Date(path.createdTime).getMonth()}/{new Date(path.createdTime).getYear()}</small>
                      </div>
                      <div className="flex-row shrink">
                        <div className="icon">
                          <img src={journalIcon} alt={"Journal"} />
                        </div>
                        <small className="small">{JSON.parse(path.searchString)}</small>
                      </div>
                    </div>
                  <div className="path-metadata-box-separator"/>
                </div>
              )
            }
          </div>
        </Modal>
      </>
    )
  }
}
