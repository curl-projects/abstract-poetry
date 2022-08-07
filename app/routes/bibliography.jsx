import glass from "../../public/assets/Glass.svg";
import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node"
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { handleBibliographySearch, gatherAndFilterReferences, processBibliography } from "~/models/semantic-bibliography.server";
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"
import * as localforage from "localforage";

import { BibliographyHeader } from "~/components/Bibliography/bibliography-header"

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
    const processedBibliography = await processBibliography(bibliographySearchResult.references,
                                                            bibliographySearchResult.clusteredReferences,
                                                            bibliographySearchResult.refDict,
                                                            bibliographySearchResult.doi,
                                                            user.id)
    return { bibliographySearchResult, processedBibliography }
  }
  return { bibliographySearchResult }
}

export default function BibliographySearch(props){
  const loaderData = useLoaderData();
  const data = useActionData();
  const [messageExists, setMessageExists] = useState(false)
  const coldStartFetcher = useFetcher();
  const redirectFetcher = useFetcher();
  const [url, setUrl] = useState('/');

  useEffect(() => {
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
    console.log("ACTION DATA:", data)
  }, [data])

  useEffect(()=>{
    console.log("COLD START STATUS:", coldStartFetcher.data)
  }, [coldStartFetcher.data])


  useEffect(()=>{
    if(data?.processedBibliography){
      localforage.setItem("activeNodeId", data.processedBibliography.activeNodeId);
      localforage.setItem("algParams", data.processedBibliography.algParams);
      localforage.setItem("clusters", data.processedBibliography.clusters);
      localforage.setItem("forceNodes", data.processedBibliography.forceNodes);
      localforage.setItem("nodeIdCounter", data.processedBibliography.nodeIdCounter);
      localforage.setItem("searchString", data.processedBibliography.searchString);
      localforage.setItem("traversalPath", data.processedBibliography.traversalPath);
      localforage.setItem("pathName", data.processedBibliography.pathName);
      localforage.setItem("clusterCounter", data.processedBibliography.clusterCounter);
      localforage.setItem("pathId", data.processedBibliography.pathId);

      const tree = new TreeModel();
      const root = tree.parse(data.processedBibliography.traversalPath)
      console.log("ROOT MODEL", data.processedBibliography.traversalPath)
      console.log("ROOT", root)
      const mostRecentNode = root.first(function(node){
        console.log("NODE!!", node)
        return node.model.attributes.nodeId === data.processedBibliography.activeNodeId
      })

      console.log("MOST RECENT NODE:", mostRecentNode)
      const redirectURL = slugifyDoi(mostRecentNode.model.attributes.doi) || ''
      const updateIndex = data.processedBibliography.clusters[mostRecentNode.model.attributes.doi]
      redirectFetcher.submit({redirectURL: data.tour ? `${redirectURL}?isPathRedirect=true&tour=true&updateIndex=${updateIndex}&impression=true` :`${redirectURL}?isPathRedirect=true&updateIndex=${updateIndex}&impression=true`}, {
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
      <Form method='post' className="bibliography-form">
      <div id="searchbar" className="bib-search bib-flex-space-between">

          <div className="search-input" style={{ display: "inline-flex", width: "100%" }}>
            <input type="text" autoFocus name="doiInput" placeholder={loaderData.user ? "Generate bibliography from DOI" : "Please log in to generate semantic bibliographies"} />
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
    </Form>
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
//
// {"paperId": "6a839c647650fdc4aed60e36b12d7b5cee8855c0",
//   "title": "The role of veterans affairs in emergency management: a systematic literature review.",
//   "abstract": "UNLABELLED\nThe Department of Veterans Affairs (VA) is a key player in emergency management for both veterans and civilians. Unfortunately, limited evidence-based research findings exist regarding the role and experience of VA during disasters. The present study is a systematic literature review of 41 published, peer-reviewed articles regarding VA and emergency management. Trained researchers utilized a data abstraction tool and conducted a qualitative content analysis. A      description of article characteristics include methodology, phase of emergency management addressed in the research, and study design. Five topic categories emerged from the review including effects of disaster on mental health status and services use, effects of disaster on general health services use, patient tracking, evacuation, and disaster planning/preparation. Findings were used to generate suggestions for future research.\n\n\nKEYWORDS\nVeterans Affairs, veterans, disaster,  emergency.",
//   "referenceCount": 0.0,
//   "citationCount": 2.0,
//   "influentialCitationCount": 0.0,
//   "fieldsOfStudy": "['Medicine']",
//   "publicationDate": null,
//   "authors": "[{'authorId': '34679742', 'name': 'M. Claver'}, {'authorId': '31483816', 'name': 'D. Friedman'}, {'authorId': '2290112', 'name': 'A. Dobalian'}, {'authorId': '3230661', 'name': 'K. Ricci'}, {'authorId': '51909111', 'name': 'Melanie Horn Mallers'}]"}
