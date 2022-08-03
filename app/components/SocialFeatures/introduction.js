import back from "../../../public/assets/back.svg";
import { useState } from 'react';
import { Markup } from "interweave";

export function Introduction(){
  const [introOpen, setIntroOpen] = useState(false);
  const introText = [
    "Hey! Welcome to Abstract Poetry. We’re Finn, Andre and Ellie.",
    "The goal of Abstract Poetry is to create a new way to search academia, one that’s more intuitive and exploratory than a search bar. This interface probably looks very different than the search engines that you’re used to, so we wrote this to provide an introduction to the way that we think about search.",
    "The most important difference between traditional search and Abstract Poetry is that we’re stateful. We remember what you’ve told us about your search, so when you can’t find what you’re looking for, it’s often better to keep refining your existing search than to give up and enter a new search term.",
    "We work with <b>impressions</b> rather than <b>keywords</b>. Your job when searching is to tell us whether you want to see more papers like the examples that we show you, or less. We also work (mostly) with <b>meaning</b> rather than <b>metadata</b>. All of the papers that the algorithm finds are grouped by how similar their content is."
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
        <div style={{ width: "100%", height: "60px"}}/>
        </>
      }
      {!introOpen &&
      <div className="intro-center">
        <p style={{cursor: 'pointer'}} onClick={()=>setIntroOpen(true)}>
          New to Abstract Poetry? Check out our <span onClick={()=>setIntroOpen(true)}
                                                       className="intro-span">introduction</span>.
        </p>
      </div>
      }
    </div>
  )
}
