import ls from "local-storage"
import {reactLocalStorage} from 'reactjs-localstorage';
import * as localforage from "localforage";
import { deslugifyDoi } from "~/utils/doi-manipulation"
import TreeModel from 'tree-model';

// export async function updateVisitedPapers(doi, setter=null){
//   const visitedPapers = ls.get('visitedPapers')
//   if(visitedPapers === null){
//     ls.set("visitedPapers", [deslugifyDoi(doi)])
//     if(setter !== null){
//       setter([deslugifyDoi(doi)])
//     }
//   }
//   else{
//     console.log("HELLO!:", visitedPapers[visitedPapers.length - 1])
//     if(visitedPapers[visitedPapers.length - 1] === deslugifyDoi(doi)){
//       ls.set("visitedPapers", visitedPapers)
//       if(setter !== null){
//         setter(visitedPapers)
//       }
//       return visitedPapers
//     }
//     visitedPapers.push(deslugifyDoi(doi))
//     ls.set("visitedPapers", visitedPapers)
//     if(setter !== null){
//       setter(visitedPapers)
//     }
//   }
//   return visitedPapers
// }

export async function updateTraversalPath(doi, algParams, pathSetter=null, recentNodeSetter=null){
  try{
    const rootModel = await localforage.getItem("traversalPath")
    if(rootModel === null){
      throw "Root does not exist -- you might be beginning your search"
    }
    const mostRecentNodeSchema = await localforage.getItem("mostRecentNode")
    console.log("MOST RECENT NODE SCHEMA:", mostRecentNodeSchema)
    // If the most recently visited path is the current path, don't update the tree
    if(mostRecentNodeSchema.attributes.doi === deslugifyDoi(doi)){
      if(pathSetter !== null){
        pathSetter(rootModel)
        recentNodeSetter(mostRecentNodeSchema)
      }
      return rootModel
    }

    // Otherwise, update the path and most recent node

    // First, build the tree from the data
    const tree = new TreeModel();
    const root = tree.parse(rootModel)

    // Then, find the most recent node in the tree
    // This assumes there's only one node in the tree with a DOI -- need a Node id system if this doesn't hold true
    const mostRecentNode = root.first(function(node){
      return node.model.attributes.doi === mostRecentNodeSchema.attributes.doi
    })

    const currentNode = mostRecentNode.addChild(tree.parse({name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}}))
    localforage.setItem("traversalPath", root.model)
    localforage.setItem("mostRecentNode", {name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}})
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter({name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}})
    }
    return rootModel
  }
  // If traversal path doesn't exist, create a new tree
  catch(error){
    console.log("CATCH ERROR:", error)
    var tree = new TreeModel();
    var root = tree.parse({name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}})

    // root.addChild(tree.parse({doi: "test", algParams: "finnTest"}))
    // const temp = JSON.stringify(root.model)
    //
    // console.log("STRING TEMP:", temp)
    // console.log("TEMP:", JSON.parse(temp))

    localforage.setItem("traversalPath", root.model)
    localforage.setItem("mostRecentNode", {name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}})
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter({name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams}})
    }
    return root
  }
}

export function clearVisitedPapers(){
  localforage.clear()
  // ls.clear()
}

// export async function getVisitedPapers(setter=null){
//   let visitedPapers = await localforage.setItem('visitedPapers')
//   if(setter === null){
//     return visitedPapers
//   }
//   setter(visitedPapers)
//   return visitedPapers
// }

export async function getTraversalPath(setter=null){
  let root = await ls.getObject('traversalPath')
  if(setter === null){
    return root
  }
  setter(root)
  return root
}
