import ls from "local-storage"
import {reactLocalStorage} from 'reactjs-localstorage';
import * as localforage from "localforage";
import { deslugifyDoi } from "~/utils/doi-manipulation"
import TreeModel from 'tree-model';

export async function updateTraversalPath(doi, algParams, pathSetter=null, recentNodeSetter=null){
  try{
    const rootModel = await localforage.getItem("traversalPath")
    if(rootModel === null){
      // This error is desired: it's thrown when the tree doesn't exist
      throw "Root does not exist -- you might be beginning your search"
    }
    const mostRecentNodeId = await localforage.getItem("activeNodeId")

    const tree = new TreeModel();
    const root = tree.parse(rootModel)

    // Find the active node in the tree from its id
    const mostRecentNode = root.first(function(node){
      return node.model.attributes.nodeId === parseInt(mostRecentNodeId)
    })

    // If the current path (root to active node) contains a node with the active doi
    // don't update the tree
    const path = mostRecentNode.getPath()
    if(path.filter(node => node.model.attributes.doi === deslugifyDoi(doi)).length !== 0){
      localforage.setItem("activeNodeId", mostRecentNode.model.attributes.nodeId)
      if(pathSetter !== null){
        pathSetter(rootModel)
        recentNodeSetter(mostRecentNode.model.attributes.nodeId)
      }
      return rootModel
    }

  // Otherwise, update the path and most recent node
    // Create a new node associated with the current position
    const nodeIdCounter = await localforage.getItem("nodeIdCounter")
    const childObject = {name: `${deslugifyDoi(doi)}-[[${nodeIdCounter+1}]]`, attributes: {doi: deslugifyDoi(doi), algParams: algParams, nodeId: nodeIdCounter+1, pinned: false}}
    const currentNode = mostRecentNode.addChild(tree.parse(childObject))
    localforage.setItem("traversalPath", root.model)

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
    const childObject = {name: `${deslugifyDoi(doi)}-[[1]]`, attributes: {doi: deslugifyDoi(doi), algParams: algParams, nodeId: 1, pinned: false}}
    var root = tree.parse(childObject)
    localforage.setItem("nodeIdCounter", 1)
    localforage.setItem("traversalPath", root.model)
    localforage.setItem("activeNodeId", 1)
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter(1)
    }
    return root
  }
}

export function clearTraversalPath(){
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

export async function checkIfActiveNode(id){
  const activeNodeId = await localforage.getItem("activeNodeId")
  return activeNodeId === id
}

export async function pinCurrentPaper(pathSetter){
  const activeNodeId = await localforage.getItem("activeNodeId")
  const rootModel = await localforage.getItem("traversalPath")
  const tree = new TreeModel();
  const root = tree.parse(rootModel)
  const activeNode = root.first(function(node){
    return node.model.attributes.nodeId === activeNodeId
  })

  activeNode.model.attributes.pinned = true

  localforage.setItem('traversalPath', root.model)
  pathSetter(root.model)
}

export async function findDOIFromNodeId(nodeId){
  const rootModel = await localforage.getItem("traversalPath")
  const tree = new TreeModel();
  const root = tree.parse(rootModel)
  const node = root.first(function(node){
    node.model.attributes.nodeId === nodeId
  })
  return node.model.attributes.doi
}
