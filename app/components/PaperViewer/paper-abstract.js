export function PaperAbstract(props){

  // FUNCTIONALITY
    // POTENTIAL: Abstracts highlight keywords

  return(
    <div className="abstract">
      {props.abstract ? <p>{props.abstract}</p> : <p>No abstract found for Paper "{props.doi}"</p>}
    </div>
  )
}
