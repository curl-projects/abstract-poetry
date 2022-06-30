export function PaperAbstract(props){
  return(
    <div className="PaperAbstract" style={{
      flex: 1,
      border: "2px solid blue",
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: "center"
    }}>
      <h1>Paper Abstract</h1>
      <p>PaperId: {props.paperId}</p>
    </div>
  )
}
