import back from "../../../public/assets/back.svg";
import { useState } from 'react';
import { Link } from "@remix-run/react"
import { Markup } from "interweave";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';

export function Introduction(props){
  const [introOpen, setIntroOpen] = useState(true);
  const introText = [
    "Hey! Welcome to Abstract Poetry.",
    "Our goal is to create a new way to search academia, one that’s more intuitive and exploratory than a search bar. We want to turn search into a conversation between a user and a search engine, where each learns how the other thinks.",
  ]
  return(
    <div className="abstract">
      {introOpen &&
        <>
        <div className="intro-back-div">
          <div style={{flex: 1}}/>
          <button className="intro-back-button" onClick={()=>setIntroOpen(false)}>
            <img src={back} alt="Back" />
          </button>
        </div>
        {introText.map((textString, index) =>
          <Markup key={index} content={textString} attributes={{ className: 'intro-text'}} tagName={"p"}/>
          )
        }
        <div className="call-to-action-wrapper">
          <Link to={`/share/cl6df3s440000j3315oa0mkg7?tour=true`} style={{textDecoration: 'none'}}>
            <div className='call-to-action'>
              <p className="intro-text" style={{fontWeight: "bold"}}>Take a Tour</p>
            </div>
          </Link>
        </div>
        <div style={{ width: "100%", height: "60px"}}/>
        </>
      }
      {!introOpen &&
        <div className="intro-back-div">
          <div style={{flex: 1}}/>
          <button className="intro-back-button" onClick={()=>setIntroOpen(true)}>
            <img src={back} alt="Back" style={{ transform: "rotate(180deg)"}}/>
          </button>
        </div>
      }
    </div>
  )
}

// <div className='call-to-action-icon'>
//   <ArrowForwardIosIcon/>
// </div>
