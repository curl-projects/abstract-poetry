export function PaperAbstract(props){

  // FUNCTIONALITY
    // POTENTIAL: Abstracts highlight keywords
  if(props.params.paperId){
    return(
      <div className="abstract">
        {props.abstract ? <p>{props.abstract}</p> : <p>No abstract found for Paper "{props.doi}"</p>}
        <h1> {'\u00A0'} </h1>
      </div>
    )
  }
  else{
    return(
      <div className="abstract">
        <p></p>
        <h1> {'\u00A0'} </h1>
      </div>
    )
  }
}
