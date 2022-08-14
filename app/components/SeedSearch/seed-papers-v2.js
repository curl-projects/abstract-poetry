import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"

export function SeedPapers(props){
  return(
    <div className="paper-viewer search-paper-viewer">

      <div className="flex-column search-paper-list" style={{ gap: 0, overflow: "auto" }}>

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
      </div>
    </div>
  )
}
