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
    </div>
  )
}
