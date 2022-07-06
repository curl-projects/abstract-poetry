import { Link } from "@remix-run/react"
import { slugifyDoi } from "~/utils/doi-manipulation"

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
        <Link key={index} to={`/${slugifyDoi(paper)}`}>
          <li>
            <p>{paper}</p>
          </li>
        </Link>
      )}
      </ol>
    </div>
  )
}
