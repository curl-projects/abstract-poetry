import ls from "local-storage"
import { deslugifyDoi } from "~/utils/doi-manipulation"

export function updateVisitedPapers(doi){
  let visitedPapers = ls.get('visitedPapers')
  if(visitedPapers === null){
    ls.set("visitedPapers", [deslugifyDoi(doi)])
  }
  else{
    visitedPapers.push(deslugifyDoi(doi))
    ls.set("visitedPapers", visitedPapers)
  }
  return visitedPapers
}
