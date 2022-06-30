export function PaperMetadata(props){
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
      <p>PaperId: {props.paperId}</p>
      <p>Title: {props.metadata.title}</p>
      <p>Authors: {props.metadata.authors.map(authorObj =>
        <span key={authorObj.authorId}>{authorObj.name},</span>
      )}</p>
      <p>Publication Year: {props.metadata.year}</p>
      <p>DOI: {props.metadata.doi ? props.metadata.doi : "No DOI Found"}</p>
      <p>Open Access Status: {props.metadata.isopenaccess.toString()}</p>
      <p>Citation Count: {props.metadata.citationcount}</p>
      <p>Influential Citation Count: {props.metadata.influentialcitationcount}</p>
      <p>Reference Count: {props.metadata.referencecount}</p>
    </div>
  )
}
