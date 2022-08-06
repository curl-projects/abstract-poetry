import glass from "../../public/assets/Glass.svg";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { handleBibliographySearch, gatherAndFilterReferences } from "~/models/semantic-bibliography.server";
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export async function action({ request }){
  const formData = await request.formData();
  const doiInput = formData.get('doiInput')

  const bibliographySearchResult = await handleBibliographySearch(doiInput)

  return { bibliographySearchResult }
}

export default function BibliographySearch(props){
  const data = useActionData();
  const [messageExists, setMessageExists] = useState(false)
  const coldStartFetcher = useFetcher();

  useEffect(()=>{
    coldStartFetcher.submit({}, {
      method: "post",
      action: "/warmup-bibliography-microservice"
    })
  }, [])

  useEffect(()=>{
    console.log("ACTION DATA:", data)
  }, [data])

  useEffect(()=>{
    console.log("COLD START STATUS:", coldStartFetcher.data)
  }, [coldStartFetcher.data])


  useEffect(()=>{
    if(data?.bibliographySearchResult){
      if(data.bibliographySearchResult.case === 'no-match'){
        setMessageExists(true)
      }
    }
  }, [data])

  return(
    <div className="bibliography-container">
      <Form method='post' className="bibliography-form">
      <div id="searchbar" className="bib-search bib-flex-space-between">

          <div className="search-input" style={{ display: "inline-flex", width: "100%" }}>
            <input type="text" name="doiInput" placeholder="Generate bibliography from DOI" />
          </div>
            <Tooltip title="Start New Search">
              <button type="submit" style={{ cursor: "pointer"}}>
                <img id="home-button" src={glass} alt="Home Logo" />
              </button>
            </Tooltip>
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
