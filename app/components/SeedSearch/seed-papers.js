import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import { Fade } from "react-awesome-reveal";

export function SeedPapers(props){
  return(
    <div className="paper-viewer search-paper-viewer">

      <div className="flex-column search-paper-list" style={{ gap: 0, overflow: "auto" }}>
        <Fade cascade={true} triggerOnce damping={0.01} style={{minWidth: 0, maxWidth: "100%"}}>
        {props.paperList.map((metadata, i) => {
          return (
            <PaperMetadata
              key={i}
              doi={metadata.doi}
              metadata={metadata}
              fetcher={props.fetcher}
            />
          )
        }
        )}
        </Fade>
      </div>
    </div>

  )
}
