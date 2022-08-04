import back from "../../../public/assets/back.svg";
import { useState } from 'react';
import { Link } from "@remix-run/react"
import { Markup } from "interweave";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';

export function Introduction(props){
  const [introOpen, setIntroOpen] = useState(true);
  const introText = [
    "Hey! Welcome to Abstract Poetry. We’re Finn, Andre and Ellie.",
    "The goal of Abstract Poetry is to create a new way to search academia, one that’s more intuitive and exploratory than a search bar. This interface probably looks very different than the search engines that you’re used to, so we wrote this to provide an introduction to the way that we think about search.",
    "There are three main differences between traditional search and Abstract Poetry.",
    "First and most importantly, we’re <b>stateful</b>. We remember what you’ve told us about your search, so when you can’t find what you’re looking for, it’s often better to keep refining your existing search than to give up and enter a new search term. Our goal is to create a conversation between search engine and user, both learning how the other thinks.",
    "Second, we work with <b>impressions</b> rather than <b>keywords</b>. Instead of keyword engineering, your job when searching is to tell us whether you want to see more papers like the examples that we show you, or less. Our goal is to simplify search, turning a difficult, expertise-driven activity (keyword engineering) into something intuitive.",
    "Third, we work with <b>meaning</b> rather than <b>metadata</b> (mostly). All of the papers that the algorithm finds are grouped by how similar their content is, and the search space that you’re traversing is a semantic one. We want to provide a different perspective on academic research, and to show you papers that you’re not going to find as easily searching Google Scholar.",
    "As part of our goal of enabling a conversation between user and search engine, we want to pull back the curtain of traditional search and let you see what patterns the computer’s found in your search so far. We’ve built two systems to help with that: the cluster view and the path view.",
    "The cluster view shows you the groups of papers that the computer has decided are similar to each other. The goal of our algorithm is to identify the clusters that you find the most interesting, so you can use the cluster viewer to understand the patterns that the search engine’s working with.",
    "The path view shows you all of the decisions that you’ve made in your search, and allows you to go back and change any of them. When you do, a new path is created, with all of the computer’s knowledge reverted to its previous state.",
    "Abstract Poetry is still a work in progress. We currently host all of the Public Library of Science, which is approximately 300,000 papers across medicine, biology and physics. That’s a lot of papers, but it’s still only about 0.15% of those that we have access to. Unfortunately, hosting such a massive corpus is expensive (we’re working on it!). We’re also tweaking our algorithm everyday, and you can expect it to get a lot better soon! If you want to join the discussion about those improvements, you can find our social links on the bottom right of the app.",
    "We want Abstract Poetry to cultivate a sense of discovery and exploration. It’s unlikely that you’ll stumble across the specific paper you were thinking of while searching (at least for now!). Instead, we’ve designed it to return those papers that you weren’t thinking of, but which are still relevant and useful. We hope you like it!"
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
          <div className='call-to-action'>
            <div className='call-to-action-icon'>
              <SearchIcon/>
            </div>
            <p className="call-to-action-text" onClick={()=> props.searchBarRef.current.focus()}> Start search</p>
          </div>
          <Link to={`/share/cl6df3s440000j3315oa0mkg7`} style={{textDecoration: 'none'}}>
            <div className='call-to-action'>
              <div className='call-to-action-icon'>
                <ArrowForwardIosIcon/>
              </div>
              <p className="call-to-action-text">See Example</p>
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
