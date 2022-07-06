export function PaperAbstract(props){
  return(
    <div className="PaperAbstract" style={{
      flex: 1,
      border: "2px solid blue",
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: "center",
      overflow: 'scroll'
    }}>
      <h1>Paper Abstract</h1>
      <p>DOI: {props.doi}</p>
      {props.abstract ? <p>{props.abstract}</p> : <p>No abstract found for Paper "{props.doi}"</p>}
    </div>
  )
}
