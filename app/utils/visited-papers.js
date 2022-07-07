import ls from "local-storage"
import {reactLocalStorage} from 'reactjs-localstorage';
import * as localforage from "localforage";
import { deslugifyDoi } from "~/utils/doi-manipulation"
import TreeModel from 'tree-model';

export async function updateTraversalPath(doi, algParams, pathSetter=null, recentNodeSetter=null){
  try{
    const rootModel = await localforage.getItem("traversalPath")
    if(rootModel === null){
      throw "Root does not exist -- you might be beginning your search"
    }
    const mostRecentNodeSchema = await localforage.getItem("mostRecentNode")
    const mostRecentNodeId = await localforage.getItem("activeNodeId")

    const tree = new TreeModel();
    const root = tree.parse(rootModel)


    // Find the active node
    const mostRecentNode = root.first(function(node){
      return node.model.attributes.nodeId === mostRecentNodeId
    })

    // If the most recently visited path is the current path, don't update the tree
    if(mostRecentNode.model.attributes.doi === deslugifyDoi(doi)){
      if(pathSetter !== null){
        pathSetter(rootModel)
        recentNodeSetter(mostRecentNodeId)
      }
      return rootModel
    }

  // Otherwise, update the path and most recent node
    // Create a new node associated with the current position
    const nodeIdCounter = await localforage.getItem("nodeIdCounter")
    const childObject = {name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams, nodeId: nodeIdCounter+1}}
    const currentNode = mostRecentNode.addChild(tree.parse(childObject))
    localforage.setItem("traversalPath", root.model)
    localforage.setItem("mostRecentNode", childObject)

    localforage.setItem("activeNodeId", nodeIdCounter+1)
    localforage.setItem("nodeIdCounter", nodeIdCounter+1)
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter(nodeIdCounter+1)
    }
    return rootModel
  }
  // If traversal path doesn't exist, create a new tree
  catch(error){
    console.log("CATCH ERROR:", error)
    var tree = new TreeModel();
    const childObject = {name: deslugifyDoi(doi), attributes: {doi: deslugifyDoi(doi), algParams: algParams, nodeId: 1}}
    var root = tree.parse(childObject)
    localforage.setItem("nodeIdCounter", 1)
    localforage.setItem("traversalPath", root.model)
    localforage.setItem("mostRecentNode", childObject)
    localforage.setItem("activeNodeId", 1)
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter(1)
    }
    return root
  }
}

export function clearVisitedPapers(){
  localforage.clear()
}
export async function getTraversalPath(setter=null){
  let root = await ls.getObject('traversalPath')
  if(setter === null){
    return root
  }
  setter(root)
  return root
}
