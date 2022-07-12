export function PaperMetadata(props){
  if(props.metadata){
    return(
      <div className="metadata flex-column" style = {{gap: "var(--space-xxs)"}}>
        <h3>{props.metadata.title}</h3>

        {props.metadata.authors ? JSON.parse(props.metadata.authors.replace(/\'/g, "\"")).map(authorObj =>
          <h4 key={authorObj.authorId}>{authorObj.name},</h4>
        ) : ""}
       
        <small>{props.metadata.publicationDate}</small>
        
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
