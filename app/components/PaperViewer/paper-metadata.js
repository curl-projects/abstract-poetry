import calendar from "../../../public/assets/calendar.svg";
import authorIcon from "../../../public/assets/authors.svg";

import { useState } from "react";

export function PaperMetadata(props) {
  
  const [toggle, setToggle] = useState(false);
  const authors = props.metadata.authors ? JSON.parse(props.metadata.authors.replace(/\'/g, "\"")) : ["No authors found"];
  
  const options = {month: "long", year: "numeric"};
  const date = props.metadata.publicationDate ? new Date(props.metadata.publicationDate).toLocaleDateString('default', options ) : "n.d.";
  

  if (props.metadata) {
    return (
      <>

        <div className="metadata flex-column" style={{ gap: "var(--space-xxs)" }}>
          <h3 onClick={() => props.setToggle(!props.toggle)}>{props.metadata.title}</h3>

          <div className="flex-row" style={{ gap: "var(--space-unit)" }}>
            <div className="flex-row shrink">
              <div className="icon">
                <img src={calendar} alt={"Publication Date"} />
              </div>
              <small className="small">{date}</small>
            </div>
            <div className="flex-row metadata-row" onClick={() => setToggle(!toggle)}>
              <div className="icon">
                <img src={authorIcon} alt={"Authors"} />
              </div>

              {toggle ?
                authors.map((authorObj, i) => {
                  if (i === authors.length - 1) {
                    return (<small className="small shrink" key={authorObj.authorId}> {authorObj.name}</small>)
                  }
                  else {
                    return (<small className="small shrink" key={authorObj.authorId}> {authorObj.name} · </small>)
                  }
                }
                ) :
                <small className="small shrink">{authors[0].name} {authors.length === 1? "": <span>et al.</span>}</small>
                }
            </div>
          </div>
        </div>

      </>
    )
  }
  else {
    return (
      <div className="PaperMetadata" style={{
        flex: 0.5,
        border: "2px solid red",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center'
      }}>
        <p>No metadata is available for this paper</p>
      </div>
    )
  }
}
