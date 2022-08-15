import glass from "../../public/assets/Glass.svg";
import { Form, useActionData, useFetcher, useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node"
import { Tooltip } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { handleBibliographySearch, gatherAndFilterReferences, processBibliography, uploadBibliographyMetadata } from "~/models/semantic-bibliography.server";
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"
import { setItem, clearStorage } from "~/utils/browser-memory.client"
import LinearProgress from '@mui/material/LinearProgress';
import { useTransition } from "@remix-run/react";
import { BibliographyHeader } from "~/components/Bibliography/bibliography-header"
import { Fade } from "react-awesome-reveal";

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request)
  const data = {
    user: user
  }
  return json(data)
}

export async function action({ request }){
  const user = await authenticator.isAuthenticated(request)
  const formData = await request.formData();
  const doiInput = formData.get('doiInput')

  const bibliographySearchResult = await handleBibliographySearch(doiInput)
  if(bibliographySearchResult.case !== 'no-match'){
    let processBibliographyPromise = processBibliography(bibliographySearchResult.references,
                                                            bibliographySearchResult.clusteredReferences,
                                                            bibliographySearchResult.refDict,
                                                            bibliographySearchResult.doi,
                                                            user.id)
    let uploadBibliographyMetadataPromise = uploadBibliographyMetadata(bibliographySearchResult.refDict)

    let [processedBibliography, metadataResponse] = await Promise.all([
      processBibliographyPromise,
      uploadBibliographyMetadataPromise
    ])
    return { bibliographySearchResult, processedBibliography, metadataResponse }
  }
  return { bibliographySearchResult }
}

export default function BibliographySearch(props){
  const loaderData = useLoaderData();
  const data = useActionData();
  const [messageExists, setMessageExists] = useState(false);
  const [searchWidth, setSearchWidth] = useState("100%");
  const [loadingProgress, setLoadingProgress] = useState(0)
  const coldStartFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const referenceCountFetcher = useFetcher();
  const [url, setUrl] = useState('/');
  const searchRef = useRef();
  const searchInputRef = useRef();
  const transition = useTransition();

  const referencesRegression = (refCount) => {
      return (0.184*refCount + 12)*1000
  }

  useEffect(()=>{
    if(transition.state === 'submitting'){
      setLoadingProgress(0)
      referenceCountFetcher.submit({
        doi: searchInputRef.current.value
      }, {
        method: "post",
        action: "/get-reference-count"
      })
    }
    if(transition.state === 'loading'){
      setLoadingProgress(100)
    }
  }, [transition.state])

  useEffect(() => {
    clearStorage();
    if(window){
      setUrl(window.location.pathname)
    }
  }, []);

  useEffect(()=>{
    coldStartFetcher.submit({}, {
      method: "post",
      action: "/warmup-bibliography-microservice"
    })
  }, []);

  useEffect(()=>{
    if(referenceCountFetcher.data?.referenceCount?.referenceCount){
        let referenceCount = referenceCountFetcher.data.referenceCount.referenceCount
        let updateInterval = 200
        let updatePercent = 100 / (referencesRegression(referenceCount) / updateInterval)
        const timer = setInterval(() => {
          setLoadingProgress((oldProgress) => {
            return oldProgress + updatePercent
          })
        }, updateInterval);
    }
  }, [referenceCountFetcher.data])



  useEffect(()=>{
    console.warn("ACTION DATA:", data)
  }, [data])

  useEffect(()=>{
    console.log("COLD START STATUS:", coldStartFetcher.data)
  }, [coldStartFetcher.data])

  useEffect(()=>{
    if(searchRef.current){
        setSearchWidth(searchRef.current.clientWidth)
    }
  }, [searchRef.current])

  useEffect(()=>{
    if(data?.processedBibliography){
      setItem("activeNodeId", data.processedBibliography.activeNodeId);
      setItem("algParams", data.processedBibliography.algParams);
      setItem("clusters", data.processedBibliography.clusters);
      setItem("forceNodes", data.processedBibliography.forceNodes);
      setItem("nodeIdCounter", data.processedBibliography.nodeIdCounter);
      setItem("searchString", data.processedBibliography.searchString);
      setItem("traversalPath", data.processedBibliography.traversalPath);
      setItem("pathName", data.processedBibliography.pathName);
      setItem("clusterCounter", data.processedBibliography.clusterCounter);
      setItem("pathId", data.processedBibliography.pathId);

      const tree = new TreeModel();
      const root = tree.parse(data.processedBibliography.traversalPath)
      const mostRecentNode = root.first(function(node){
        return node.model.attributes.nodeId === data.processedBibliography.activeNodeId
      })

      const redirectURL = slugifyDoi(mostRecentNode.model.attributes.doi) || ''
      const updateIndex = data.processedBibliography.clusters[mostRecentNode.model.attributes.doi]
      redirectFetcher.submit({redirectURL: data.tour ? `${redirectURL}?isPathRedirect=true&tour=true&updateIndex=${updateIndex}&impression=true&isSaveOpen=true` :`${redirectURL}?isPathRedirect=true&updateIndex=${updateIndex}&impression=trueis&isSaveOpen=true`}, {
        method: "post",
        action: "/redirect-paths"
      })
    }

    else if(data?.bibliographySearchResult){
      if(data.bibliographySearchResult.case === 'no-match'){
        setMessageExists(true)
      }
    }
  }, [data])

  return(
    <div className="bibliography-container">
      <BibliographyHeader
        user={loaderData.user}
        url={url}
        />
      <div className="search-wrapper">
        <Form method='post' className="bibliography-form">
          <Fade direction="bottom" className="bibliography-fade">
            <div className="search-outer-wrapper">

            <div id="searchbar" className="bib-search bib-flex-space-between" ref={searchRef} style={{marginBottom: "140px"}}>
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }}>
              {referenceCountFetcher.data?.referenceCount && <p>Parsing {referenceCountFetcher.data.referenceCount.referenceCount} references <span style={{ color: "rgba(150, 150, 150, 0.4)"}}>{Math.min(Math.round(loadingProgress, 2), 100)}%</span></p>}
              <input type="text" autoFocus ref={searchInputRef} name="doiInput" placeholder={loaderData.user ? "Generate bibliography from DOI" : "Please log in to generate semantic bibliographies"} />
                  {transition.state === 'submitting' && <LinearProgress variant="determinate" value={transition.state === 'loading' ? 100 : loadingProgress} style={{width: searchWidth, height: "2px", color: 'rgb(100, 0, 236)', backgroundColor: 'rgba(100, 0, 236, 0.3)'}}/>}
            </div>
            {loaderData.user
              ? <Tooltip title="Start New Search">
                  <button type="submit" style = {loaderData.user ? { cursor: "pointer"} : { filter: "brightness(200%)"}}>
                    <img id="home-button" src={glass} alt="Home Logo" />
                  </button>
                </Tooltip>
              : <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${url}`}
                >
                  <input type='hidden' name="url" value={url}/>
                  <button type="submit"><p className="bib-login-text">Log in</p></button>
                </Form>
            }
        </div>
        {(!(transition.state==='submitting')) &&
        <p class="small" style={{position: "relative", bottom: "120px"}}>
          <Link to={"/search"} style={{textDecoration:"none",
                                             color: "rgba(var(--clr-grey-500), 1)"}}>
            Click here to perform a Semantic Search instead
          </Link>
        </p>
        }
      </div>
      </Fade>
      </Form>
    </div>
    <Snackbar
      open={messageExists}
      autoHideDuration={4000}
      message={data?.bibliographySearchResult ? data.bibliographySearchResult.message : ""}
      onClose={()=>setMessageExists(false)}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            sx={{ p: 0.5 }}
            color="inherit"
            onClick={() => setMessageExists(false)}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
      />
    </div>
  )
}
