import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import home from "../../../public/assets/home.svg";
import { Form, useParams, Link, useFetcher, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import { SocialsProvider } from "remix-auth-socials";
import Modal from '@mui/material/Modal';
import * as localforage from "localforage";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"

export function Header(props) {
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false)
  const [url, setUrl] = useState('/')
  const savePathFetcher = useFetcher();
  const readPathFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const submit = useSubmit();

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
      pathId: props.pathId
    }, {
      method: "post",
      action: "/save-path"
    })
  }

  function handlePathInit(path){
    localforage.setItem("activeNodeId", parseInt(path.activeNodeId))
    localforage.setItem("algParams", JSON.parse(path.algParams))
    localforage.setItem("clusters", JSON.parse(path.clusters))
    localforage.setItem("forceNodes", JSON.parse(path.forceNodes))
    localforage.setItem("nodeIdCounter", parseInt(path.nodeIdCounter))
    localforage.setItem("pathId", path.pathId)
    localforage.setItem("searchString", JSON.parse(path.searchString))
    localforage.setItem("traversalPath", JSON.parse(path.traversalPath))

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
    console.log("READ PATH FETCHER DATA:", readPathFetcher.data)
  }, [readPathFetcher])

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
              <div className="user-text-wrapper">
                  <div style={{marginRight: '5px'}}>
                    <button onClick={handleSaveClick}>
                      <p>Save</p>
                    </button>
                  </div>
                  <div>
                    <Form action="/logout" method="post">
                      <input type='hidden' name="url" value={url}/>
                      <button type="submit">
                        <p className="logout-text">Logout</p>
                      </button>
                    </Form>
                  </div>
              </div>
              <button onClick={()=>setModalOpen(true)}>
                  <img src={account} className="account-button" fill='666666' alt="Account Button" />
              </button>
              </>
            }
            {!props.user &&
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${url}`}
                >
                <button type='submit'>
                    <img src={account} className="account-button" fill='666666' alt="Account Button" />
                </button>
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
              <button type="submit" style={{ cursor: "pointer", paddingTop: '10px' }}>
                <img src={home} alt="Home Logo" />
              </button>
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
              <h2>Loading</h2>
              :
              readPathFetcher.data?.traversalPaths.map((path, index) =>
                <div key={index}>
                  <button onClick={()=>handlePathInit(path)}>
                    <p>{path.pathId} [{path.searchString}]</p>
                  </button>
                </div>
              )
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
              <div className="user-text-wrapper">
                  <div className="logout-text-wrapper">
                    <Form action="/logout" method="post">
                      <input type='hidden' name="url" value={url}/>
                      <button type="submit">
                        <p className="logout-text">Logout</p>
                      </button>
                    </Form>
                  </div>
              </div>
              <div>
                <button onClick={()=>setModalOpen(true)}>
                    <img src={account} className="account-button" fill='666666' alt="Account Button" />
                </button>
              </div>
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
                <button type='submit'>
                    <img src={account} className="account-button" fill='666666' alt="Account Button" />
                </button>
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
            <h2>Hello</h2>
          </div>
        </Modal>
      </>
    )
  }
}
