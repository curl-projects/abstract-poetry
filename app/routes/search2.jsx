import glass from "../../public/assets/Glass.svg";
import { Tooltip } from "@mui/material";
import { BibliographyHeader } from "~/components/Bibliography/bibliography-header"
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/models/auth.server.js";
import { json } from "@remix-run/node"
import { useEffect, useState, useRef } from "react";
import { clearStorage } from "~/utils/browser-memory.client"
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request)
  const data = {
    user: user
  }
  return json(data)
}


export default function Search2(props){
  const loaderData = useLoaderData();
  const [url, setUrl] = useState('/');
  const [messageExists, setMessageExists] = useState(false);


  useEffect(() => {
    clearStorage();
    if(window){
      setUrl(window.location.pathname)
    }
  }, []);

  return(
    <div className="bibliography-container">
      <BibliographyHeader
        user={loaderData.user}
        url={url}
        />
      <div id="searchbar" className="bib-search bib-flex-space-between">
          <div className="search-input" style={{ display: "inline-flex", width: "100%" }}>
            <input type="text" autoFocus name="doiInput" placeholder={"Explore all of PLOS with keywords or DOIs"} />
      </div>
      <Tooltip title="Start New Search">
          <button type="submit" style = {{ cursor: "pointer"}}>
            <img id="home-button" src={glass} alt="Home Logo" />
          </button>
        </Tooltip>

      </div>

    <Snackbar
      open={messageExists}
      autoHideDuration={4000}
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
