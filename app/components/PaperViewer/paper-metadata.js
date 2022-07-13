import calendar from "../../../public/assets/calendar.svg";
import { MetadataBit } from "./static";
import authors from "../../../public/assets/authors.svg";


export function PaperMetadata(props) {
  if (props.metadata) {
    return (
      <>
        
        <div className="metadata flex-column" style={{ gap: "var(--space-xxs)" }}>
          <h3>{props.metadata.title}</h3>

          <div className="flex-row metadata-row">
            <div className="flex-row">
              <img src={calendar} alt={"Publication Date"} />
              <small className="small">{props.metadata.publicationDate}</small>
            </div>
            <div className="flex-row">
              <img src={authors} alt={"Authors"} />
              {props.metadata.authors ? JSON.parse(props.metadata.authors.replace(/\'/g, "\"")).map(authorObj =>
                <small className="small" key={authorObj.authorId}>{authorObj.name} </small>
              ) : ""}
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
