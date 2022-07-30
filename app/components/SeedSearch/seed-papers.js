import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import React from 'react';

export function SeedPapers(props){
  return(
    <div className="flex-column" style={{ gap: 0, overflow: "auto" }}>

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
  )
}
