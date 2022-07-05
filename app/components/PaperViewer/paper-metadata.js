export function PaperMetadata(props){
  if(props.metadata){
    return(
      <div className="PaperMetadata" style={{
        flex: 0.5,
        border: "2px solid red",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center'
      }}>
        <h1>Paper Metadata</h1>
        <p>DOI: {props.doi}</p>
        <p>Title: {props.metadata.title}</p>
        <p>Authors: {props.metadata.authors ? JSON.parse(props.metadata.authors.replace(/\'/g, "\"")).map(authorObj =>
          <span key={authorObj.authorId}>{authorObj.name},</span>
        ) : <span />}
        </p>
        <p>Publication Date: {props.metadata.publicationDate}</p>
        <p>Citation Count: {props.metadata.citationCount}</p>
        <p>Influential Citation Count: {props.metadata.influentialCitationCount}</p>
        <p>Reference Count: {props.metadata.referenceCount}</p>
      </div>
    )
  }
  else{
    return(
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
