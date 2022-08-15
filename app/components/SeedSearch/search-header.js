import account from "../../../public/assets/account.svg";
import logout from "../../../public/assets/logout.svg";
import path from "../../../public/assets/path-search.svg";
import calendar from "../../../public/assets/calendar.svg";
import journalIcon from "../../../public/assets/journal.svg"
import { setItem, getItem } from "~/utils/browser-memory.client"

import { SocialsProvider } from "remix-auth-socials";
import { useState, useEffect } from 'react';
import { Form, useParams, Link, useFetcher, useSubmit } from "@remix-run/react";
import { Tooltip } from "@mui/material";
import Modal from '@mui/material/Modal';
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"

export function SearchHeader(props){
  const [modalOpen, setModalOpen] = useState(false)
  const readPathFetcher = useFetcher();
  const redirectFetcher = useFetcher();

  useEffect(()=>{
    if(modalOpen){
      readPathFetcher.submit({
      }, {
        method: "get",
        action: "/get-paths"
      })
    }
  }, [modalOpen])

  function handlePathInit(path){
    setItem("activeNodeId", parseInt(path.activeNodeId))
    setItem("algParams", JSON.parse(path.algParams))
    setItem("clusters", JSON.parse(path.clusters))
    setItem("forceNodes", JSON.parse(path.forceNodes))
    setItem("nodeIdCounter", parseInt(JSON.parse(path.forceNodes).links.length)) // TODO: unnecessary, maybe a bad refactor? Did so bc error conditions were ambiguous
    setItem("pathId", path.pathId)
    setItem("searchString", path.searchString)
    setItem("traversalPath", JSON.parse(path.traversalPath))
    setItem("pathName", path.pathName)
    setItem("clusterCounter", JSON.parse(path.clusterCounter))

    const tree = new TreeModel();
    const root = tree.parse(JSON.parse(path.traversalPath))

    const mostRecentNode = root.first(function(node){
      return node.model.attributes.nodeId === parseInt(path.activeNodeId)
    })
    const redirectURL = slugifyDoi(mostRecentNode.model.attributes.doi) || ''
    const updateIndex = JSON.parse(path.clusters)[mostRecentNode.model.attributes.doi]

    redirectFetcher.submit({redirectURL: `${redirectURL}?isPathRedirect=true&updateIndex=${updateIndex}&impression=true`}, {
      method: "post",
      action: "/redirect-paths"
    })
  }

  return(
    <>
      <div className="header-wrapper">
        <div className="user-control-wrapper">
          {props?.user &&
            <>
                <div style={{display: "flex", alignItems: "center"}}>
                  <Form action="/logout" method="post">
                    <input type='hidden' name="url" value={props.url}/>
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
                    <input type='hidden' name="url" value={props.url}/>
                    <button type="submit">
                      <p className="logout-text"></p>
                    </button>
                </div>
            </div>
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${props.url}`}
                >
                <input type='hidden' name="url" value={props.url}/>
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
          readPathFetcher.data?.traversalPaths.length !== 0 ?

          readPathFetcher.data?.traversalPaths.sort(function(a,b){return new Date(b.createdTime) - new Date(a.createdTime)}).map((path, index) =>
            <div key={index} className="modal-path-box" onClick={()=>handlePathInit(path)}>
                <div>
                  <h2 className="modal-path-box-pathname">{path.pathName}</h2>
                </div>
                <div className='path-metadata-box'>
                  <div className="flex-row shrink">
                    <div className="icon">
                      <img src={calendar} alt={"Created Date"} />
                    </div>
                    <small className="small">{new Date(path.createdTime).getDate()}/{new Date(path.createdTime).getMonth()}/{`${new Date(path.createdTime).getYear()}`.slice(1)}</small>
                  </div>
                  <div className="flex-row shrink">
                    <div className="icon">
                      <img src={journalIcon} alt={"Journal"} />
                    </div>
                    <small className="small">{path.searchString}</small>
                  </div>
                </div>
              <div className="path-metadata-box-separator"/>
            </div>
          )
          :
          <div>
            <p>No search paths found</p>
          </div>
        }
      </div>
    </Modal>
    </>
    )
  }
