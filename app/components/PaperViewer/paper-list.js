import { PaperMetadata } from "~/components/PaperViewer/paper-metadata.js"
import React from 'react';

export function PaperList(props){
  return(
    <div className="flex-column paper-list" style={{ gap: 0, overflow: "auto" }}>

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
