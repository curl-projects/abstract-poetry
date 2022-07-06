import ls from "local-storage"
import { deslugifyDoi } from "~/utils/doi-manipulation"

export async function updateVisitedPapers(doi, setter=null){
  const visitedPapers = ls.get('visitedPapers')
  if(visitedPapers === null){
    ls.set("visitedPapers", [deslugifyDoi(doi)])
    if(setter !== null){
      setter([deslugifyDoi(doi)])
    }
  }
  else{
    console.log("HELLO!:", visitedPapers[visitedPapers.length - 1])
    if(visitedPapers[visitedPapers.length - 1] === deslugifyDoi(doi)){
      ls.set("visitedPapers", visitedPapers)
      if(setter !== null){
        setter(visitedPapers)
      }
      return visitedPapers
    }
    visitedPapers.push(deslugifyDoi(doi))
    ls.set("visitedPapers", visitedPapers)
    if(setter !== null){
      setter(visitedPapers)
    }
  }
  return visitedPapers
}

export function clearVisitedPapers(){
  ls.clear()
}

export async function getVisitedPapers(setter=null){
  let visitedPapers = await ls.get('visitedPapers')
  if(setter === null){
    return visitedPapers
  }
  setter(visitedPapers)
  return visitedPapers
}
