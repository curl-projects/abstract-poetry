import glass from "../../public/assets/Glass.svg";
import { Tooltip } from "@mui/material";
import { SearchHeader } from "~/components/SeedSearch/search-header"
import { useLoaderData, useActionData, Form, useFetcher, useTransition, Link } from "@remix-run/react";
import { authenticator } from "~/models/auth.server.js";
import { json } from "@remix-run/node"
import { useEffect, useState, useRef } from "react";
import { setItem, getItem, clearStorage } from "~/utils/browser-memory.client"
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { slugifyDoi, deslugifyDoi } from "~/utils/doi-manipulation"
import { PaperData } from "~/components/PaperViewer/paper-data.js"
import { SeedPapers } from "~/components/SeedSearch/seed-papers"
import { handleSearchv2 } from "~/models/search.server"
import { Fade } from "react-awesome-reveal";
import LinearProgress from '@mui/material/LinearProgress';
import { SocialsBar } from "~/components/SocialFeatures/socials-bar"

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request)
  const data = {
    user: user
  }
  return json(data)
}

export async function action({ request }){
  const formData = await request.formData();
  const searchString = formData.get('searchString')
  const handleSearchOutput = await handleSearchv2(searchString)

  return json({...handleSearchOutput, searchString: searchString})

}

export default function Search2(props){
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const coldStartFetcher = useFetcher();
  const clusterFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const [url, setUrl] = useState('/');
  const [paperSelection, setPaperSelection] = useState(false)
  const [errorExists, setErrorExists] = useState(false);
  const [headerMessage, setHeaderMessage] = useState("")
  const transition = useTransition();
  const searchRef = useRef();

  useEffect(()=>{
    if(window){
      setUrl(window.location.pathname)
    }
    coldStartFetcher.submit({}, {
      method: "post",
      action: "/warmup-microservice"
    })
    // Clears local storage whenever the search page loads, resetting the algorithm
    clearStorage();
  }, [])

  useEffect(()=>{
    // Keeps track of search error state, opening and closing the snackbar
    if(actionData?.action === 'error'){
      setErrorExists(true)
      setHeaderMessage("Start searching with a DOI or keyword")
    }
    if(actionData?.action === 'select-papers'){
      setPaperSelection(true)
      setHeaderMessage("Choose a paper you're interested in, and we'll find our closest match")
    }
    else if(actionData?.action === 'redirect'){
      setHeaderMessage("Searching for relevant papers")
      clusterFetcher.submit({
        doi: deslugifyDoi(actionData.doiString),
        keywordSearch: false,
        referencesList: actionData.referencesList
      }, {
        method: "post",
        action: "/cluster-papers"
      })
    }
  }, [actionData])

  useEffect(async()=>{
    if(clusterFetcher.data){
      // separating these if statements to capture the error
      if(clusterFetcher.data.cluster){
        await setItem("clusters", clusterFetcher.data.cluster)
        const redirectURL = (clusterFetcher.data.seedDOI
                ? `/${slugifyDoi(clusterFetcher.data.seedDOI)}?message=${actionData.case}&searchString=${actionData.searchString}`
                : `/${actionData.doiString}?message=${actionData.case}&searchString=${actionData.searchString}`)
        redirectFetcher.submit({ redirectURL: redirectURL}, {
          method: "post",
          action: "/redirect-paths"
        })
      }
      else{
        setErrorExists(true)
      }
    }
  }, [clusterFetcher.data])

  useEffect(()=>{
    console.log("CLUSTER FETCHER", clusterFetcher.type)
  }, [clusterFetcher.type])

  useEffect(()=>{
    if(clusterFetcher.state === "submitting" || transition.state === 'submitting'){
      setHeaderMessage("Searching for relevant papers")
    }
  }, [clusterFetcher.state, transition])

  return(
    <div className="bibliography-container">
      <SearchHeader
        user={loaderData.user}
        url={url}
        />
      <div className="search-wrapper">
      <Form method='post' className="bibliography-form">
        <Fade direction="bottom" className="bibliography-fade">
          <div className="search-outer-wrapper">
            <p className="search-text" style={(actionData?.doiList && !(['actionSubmission', 'actionReload', 'done'].includes(clusterFetcher.type))) ? {color: "rgba(var(--clr-grey-200), 0.8)", fontWeight: 'bold'} : {}}>{headerMessage}</p>
          <div id="searchbar" className="bib-search bib-flex-space-between" style={(actionData?.doiList ? {} : {marginBottom: "140px"})}>
          <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <input type="text" name="searchString" placeholder="Explore all of PLOS with keywords or DOIs" autoFocus/>
              {(transition.state === 'submitting' || clusterFetcher.state === 'submitting') && <LinearProgress variant="indeterminate" style={{width: "100%", height: "2px", color: 'rgb(100, 0, 236)', backgroundColor: 'rgba(100, 0, 236, 0.3)'}}/>}
          </div>
          <Tooltip title="Start New Search">
              <button type="submit" style = {{ cursor: "pointer" }}>
                <img id="home-button" src={glass} alt="Home Logo" />
              </button>
            </Tooltip>

          </div>
          {(!actionData && !(transition.state==='submitting')) &&
          <>
          <p className="small" style={{position: "relative", bottom: "120px"}}>
            <Link to={"/bibliography"} style={{textDecoration:"none",
                                               color: "rgba(var(--clr-grey-500), 1)"}}>
              Click here to generate a Semantic Bibliography instead
            </Link>
          </p>
          <small style={{position: "relative", bottom: "110px"}}>
            New Here?&nbsp;
            <Link to={`/share/cl6smskk000326731lifpgufc`} style={{color: "black"}}>
              See an example search
            </Link>
            &nbsp;or&nbsp;
            <Link to={`/share/cl6df3s440000j3315oa0mkg7?tour=true`} style={{color: "black"}}>
             take a tour
            </Link>
          </small>
          </>
          }
        </div>
        </Fade>
      </Form>

      {actionData?.doiList &&
        <SeedPapers
          paperList={actionData?.doiList ? actionData.doiList : Array(10).fill(0)}
          fetcher={clusterFetcher}
          />
      }
    </div>

    <SocialsBar />

    <Snackbar
      open={errorExists}
      autoHideDuration={4000}
      message={actionData ? actionData.message : clusterFetcher.data?.error}
      onClose={()=>setErrorExists(false)}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            sx={{ p: 0.5 }}
            color="inherit"
            onClick={() => setErrorExists(false)}
            >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
    </div>
  )
}
