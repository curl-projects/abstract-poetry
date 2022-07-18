import share from "../../../public/assets/share.svg";
import { useFetcher } from "@remix-run/react"

export function Share(props){
  const fetcher = useFetcher();

  return (
    <div className="traversal-share" style={{pointerEvents: 'none'}}>
      <form method="post" action="/create-reading-list">
        <input type="hidden" name="rootModel" value={JSON.stringify(props.traversalPath)} />
        <input type="hidden" name="citationStyle" value="apa" />
        <button type="submit" className="abs-left toolbar panel-glass"
             style={{pointerEvents: 'auto', cursor: "pointer"}} >
          <img src={share} alt="Share or Export Reading List"/>
        </button>
      </form>
    </div>
  )

}
