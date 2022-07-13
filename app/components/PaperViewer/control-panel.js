import { Form, useParams, useFetcher, Link } from "@remix-run/react";
import { useRef, useState, useEffect } from "react";
import { deslugifyDoi, slugifyDoi } from "~/utils/doi-manipulation";
import { pinCurrentPaper } from "~/utils/visited-papers";
import useKeyPress from "react-use-keypress";


export function ControlPanel(props){
  const params = useParams();
  const keys = ['p', "P", 'r', "R", "e", "E", 'ArrowLeft', "ArrowRight"]
  const positiveSubmitRef = useRef();
  const negativeSubmitRef = useRef();
  const exportRef = useRef();
  const fetcher = useFetcher();
  const [negativeDOI, setNegativeDOI] = useState(null);
  const [positiveDOI, setPositiveDOI] = useState(null);

  // Preloading
    // Submit a form to a specified action without reloading when the page renders
    // This form saves the output of the computation somewhere (where?)
      // Could save DOIs into URL?
  useEffect(()=>{
    if((Object.keys(props.traversalPath).length !== 0) && (typeof props.mostRecentNode === "number")){
      fetcher.submit({hello: 'finn',
                      doi: deslugifyDoi(params.paperId),
                      traversalPath: JSON.stringify(props.traversalPath),
                      mostRecentNode: JSON.stringify(props.mostRecentNode)},

                      {method: "post", action: '/preload-impressions'})
    }
  }, [props.traversalPath, props.mostRecentNode])

  useEffect(()=>{
    console.log("FETCHER DATA", fetcher.data)
    if(fetcher.data?.negativeImpression){
        setNegativeDOI(fetcher.data.negativeImpression.id)
        setPositiveDOI(fetcher.data.positiveImpression.id)
    }
  }, [fetcher])

  // Key-Press Control
  useKeyPress(keys, event=>{
    if(event.key === "ArrowRight"){
      positiveSubmitRef.current.click()
    }

    else if(event.key === "ArrowLeft"){
      negativeSubmitRef.current.click()
    }

    else if(event.key === 'p' || event.key === 'P'){
      pinCurrentPaper(props.setTraversalPath)
    }
    else if(event.key === 'r' || event.key === "R"){
      window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank")
    }

    else if(event.key === 'e' || event.key === "E"){
      exportRef.current.click()
    }
  })

  // TODO: citationStyle needs a drop-down
  return(
    <div className="ControlPanel" style={{
        border: '2px solid yellow',
        flex: 0.5,
        margin: "20px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>Control Panel</h1>
        <div className="ButtonWrapper" style={{
          display: 'flex',
        }}>

        <Form method="post">
          <input type="hidden" name="traversalPath" value={JSON.stringify(props.traversalPath)}/>
          <input type="hidden" name="mostRecentNode" value={JSON.stringify(props.mostRecentNode)}/>
          {negativeDOI &&
            <React.Fragment>
              <Link to={`/${slugifyDoi(negativeDOI)}`} ref={negativeSubmitRef}>
                <button
                  name="impression"
                  type="button"
                  style={{
                    margin: "10px",
                    height: "40px"
                  }}>Less Like This</button>
              </Link>
              <Link to={`/${slugifyDoi(positiveDOI)}`} ref={positiveSubmitRef}>
                <button
                  name="impression"
                  type="button"
                  value="true"
                  style={{
                    margin: "10px",
                    height: "40px"
                  }}>More Like This</button>
              </Link>
            </React.Fragment>
          }
          {!negativeDOI &&
            <React.Fragment>
              <button
                name="impression"
                type="submit"
                value="false"
                ref={negativeSubmitRef}
                style={{
                  margin: "10px",
                  height: "40px"
                }}>Less Like This</button>
              <button
                name="impression"
                type="submit"
                value="true"
                ref={positiveSubmitRef}
                style={{
                  margin: "10px",
                  height: "40px"
                }}>More Like This</button>
            </React.Fragment>
          }

        </Form>
          <button onClick={() => pinCurrentPaper(props.setTraversalPath)}>Pin Paper</button>
          <button onClick={()=> window.open(`https://www.doi.org/${deslugifyDoi(params.paperId)}`, "_blank")}>Read Paper</button>
        <form method="post" action="/create-reading-list">
          <input type="hidden" name="rootModel" value={JSON.stringify(props.traversalPath)} />
          <input type="hidden" name="citationStyle" value="apa" />
          <button type="submit" ref={exportRef}>Export Reading List</button>
        </form>

        </div>

    </div>
  )
}
