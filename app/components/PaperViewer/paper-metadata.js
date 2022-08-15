import calendar from "../../../public/assets/calendar.svg";
import authorIcon from "../../../public/assets/authors.svg";
import journalIcon from "../../../public/assets/journal.svg"
import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react"
import { slugifyDoi, doiToJournal } from "~/utils/doi-manipulation"

export function PaperMetadata(props) {
  const [authorToggle, setAuthorToggle] = useState(false);
  const [journalToggle, setJournalToggle] = useState(false);
  const [journal, setJournal] = useState("Unknown Journal")
  const [authors, setAuthors] = useState(null)
  const params = useParams();


  useEffect(()=>{
    if(props.metadata?.journal && props.metadata.journal.name && props.metadata.journal?.name !== ""){
      if(journalToggle){
        setJournal(props.metadata.journal.name)
      }
      else{
        if(props.metadata.journal.name.length > 10){
          setJournal(`${props.metadata.journal.name.slice(0, 10)}...`)
        }
        else{
          setJournal(props.metadata.journal.name)
        }
      }
    }
    else if(props.doi){
      setJournal(doiToJournal(props.doi))
    }
    else{
        setJournal("Unknown Journal")
      }
  }, [props.doi, props.metadata, journalToggle])


  useEffect(() => {
    console.log("METADATA:", props.metadata)
  }, [props.metadata])

  useEffect(() => {
    if(props.metadata?.authors){
      // necessary because in search.jsx authors is already parsed into a list,
      // but it's not in paperId
      if(typeof props.metadata.authors === 'string'){

        //TODO: this currently removes inner-name hyphens (e.g. D'Souza): come up with a better system later
        setAuthors(JSON.parse(props.metadata.authors.replace("None", "null").replace(/([a-zA-Z])+\'([a-zA-Z]+)/g, "$1$2").replace(/'/g, "\"")))
      }
      else{
        setAuthors(props.metadata.authors)
      }
    }
  }, [props.metadata])

  const options = {month: "long", year: "numeric"};
  const date = props.metadata?.publicationDate ? new Date(props.metadata.publicationDate).toLocaleDateString('default', options ) : "n.d.";

  const handlePaperRedirect = () => {
    if(params.paperId){
      props.fetcher.submit({
        redirectString: `/${slugifyDoi(props.metadata.doi)}?nodeId=${props.metadata.nodeId}`
      }, {
        method: "post",
        action: "/redirect-cluster-node"
      })
    }
    else{
      props.fetcher.submit({
        doi: null,
        paperId: props.metadata.paperId,
        keywordSearch: true
      }, {
        method: "post",
        action: "/cluster-papers"
      })
    }
  }

  if (props.metadata && authors){
    return (
      <>
        <div className="metadata flex-column paper-list" style={{ gap: "var(--space-xxs)", minWidth: 0 }}>
          <h3 onClick={props.setToggle ? ()=>props.setToggle(prevState=>!prevState) : props.fetcher ? handlePaperRedirect : ()=>console.log("CLICK!")}>{props.metadata.title}</h3>

          <div className="flex-row" style={{ gap: "var(--space-unit)", alignItems: "stretch", minWidth: 0, width: "100%" }}>
            <div className="flex-row shrink">
              <div className="icon">
                <img src={calendar} alt={"Publication Date"} style={{paddingLeft: '1px'}}/>
              </div>
              <small className="small">{date}</small>
            </div>
            <div className="flex-row shrink">
              <div className="icon">
                <img src={journalIcon} alt={"Journal"} />
              </div>
              <small className="small" onClick={() => setJournalToggle(prevState => !prevState)}>{journal}</small>
            </div>
            <div className="metadata-row" onClick={() => setAuthorToggle(!authorToggle)}>
              <div className="icon">
                <img src={authorIcon} alt={"Authors"} />
              </div>
              {(authorToggle && authors) ?
                <div className='metadata-inner-row' style={{ overflowX: 'auto', minWidth: 0}}>
                  {authors.map((authorObj, i) => {
                    if (i === authors.length - 1) {
                      return (<small className="small shrink" key={authorObj.authorId}> {authorObj.name ? authorObj.name : ""}</small>)
                    }
                    else {
                      return (<small className="small shrink" key={authorObj.authorId}> {authorObj.name ? authorObj.name : ""} · </small>)
                    }
                    })
                  }
                </div>
                 :
                <div className='metadata-inner-row'>
                  <small className="small shrink">{authors.length !== 0 ? authors[0].name : "No authors found"} {authors.length === 1 || authors.length === 0? "": <span>et al.</span>}</small>
                </div>
                }
              </div>
          </div>
        </div>
      </>
    )
  }
  else {
    return (
      <div className={props.headerMessage === "Searching for relevant papers" ? 'loading': "PaperMetadata"} style={{
        flex: 0.5,
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
      }}>
          <p style={{
              textAlign: "center"
            }}>{props.headerMessage}</p>
          {props.headerMessage === 'Searching for relevant papers' &&
            <div className="wave-center">
              {[...Array(3)].map((e, i) => <div key={i} className="wave"></div>)}
            </div>
          }
      </div>
    )
  }
}
