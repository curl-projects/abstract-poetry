export function TraversalViewer(props){
  return(
    <div className="TraversalViewer" style={{
        flex: 1,
        width: "90%",
        border: '2px dashed pink',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "scroll"
      }}>
      <ol>
      {props.visitedPapers.map((paper, index) =>
        <li key={index}>
          <p>{paper}</p>
        </li>
      )}
      </ol>
    </div>
  )
}
