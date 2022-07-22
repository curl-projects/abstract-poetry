import ls from "local-storage"
import {reactLocalStorage} from 'reactjs-localstorage';
import * as localforage from "localforage";
import { deslugifyDoi } from "~/utils/doi-manipulation"
import TreeModel from 'tree-model';

export async function updateTraversalPath(doi, algParamIndex, impression,
                                          pathSetter=null,
                                          recentNodeSetter=null,
                                          algParamsSetter=null,
                                          forceNodeSetter=null,
                                          clusterSetter=null,
                                          title){
  try{
    console.log("UPDATING")
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
    const currentAlgParams = await localforage.getItem("algParams")
    const forceNodes = await localforage.getItem('forceNodes')
    if(path.filter(node => node.model.attributes.doi === deslugifyDoi(doi)).length !== 0){
      var clusters = await localforage.getItem('clusters')
      localforage.setItem("activeNodeId", mostRecentNode.model.attributes.nodeId)
      if(pathSetter !== null){
        pathSetter(rootModel)
        recentNodeSetter(mostRecentNode.model.attributes.nodeId)
        algParamsSetter(currentAlgParams)
        forceNodeSetter(forceNodes)
        clusterSetter(clusters)
      }
      return rootModel
    }

  // Otherwise, update the path and most recent node
    // Create a new node associated with the current position

    const nodeIdCounter = await localforage.getItem("nodeIdCounter")

    // Client side parameter update
    if(JSON.parse(impression)){
        currentAlgParams[algParamIndex][0] += 1
    }
    else{
      currentAlgParams[algParamIndex][1] += 1
    }

    var clusters = await localforage.getItem('clusters')
    if(!Object.keys(clusters).includes(doi)){
      console.log("CLUSTER UPDATE EXECUTED")
      clusters[`${doi}`] = algParamIndex
    }

    const newNode = {id: `node-${nodeIdCounter+1}`,
                     name: `${deslugifyDoi(doi)}`,
                     doi: deslugifyDoi(doi),
                     title: title,
                     val: 5,
                     nodeId: nodeIdCounter+1,
                     type: 'paper',
                     pinned: false}
    const newLink = { "source": `cluster-${clusters[doi]}`, "target": `node-${nodeIdCounter+1}`}
    forceNodes.nodes.push(newNode)
    forceNodes.links.push(newLink)

    const childObject = {name: `${deslugifyDoi(doi)}-[[${nodeIdCounter+1}]]`, attributes: {doi: deslugifyDoi(doi), algParams: currentAlgParams, nodeId: nodeIdCounter+1, pinned: false, cluster: clusters[doi], title: title}}
    const currentNode = mostRecentNode.addChild(tree.parse(childObject))

    localforage.setItem("traversalPath", root.model)
    localforage.setItem("algParams", currentAlgParams)
    localforage.setItem("activeNodeId", nodeIdCounter+1)
    localforage.setItem("nodeIdCounter", nodeIdCounter+1)
    localforage.setItem("forceNodes", forceNodes)
    localStorage.setItem("forceNodes", JSON.stringify(forceNodes))
    localforage.setItem('clusters', clusters)
    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter(nodeIdCounter+1)
      algParamsSetter(currentAlgParams)
      forceNodeSetter(forceNodes)
      clusterSetter(clusters)
    }
    return rootModel
  }
  // If traversal path doesn't exist, create a new tree
  catch(error){
    if(error === "Root does not exist -- you might be beginning your search"){
      console.warn("CATCH ERROR (INTENDED):", error)
    }
    else{
      console.error("CATCH ERROR (UNINTENDED):", error)

    }
    var tree = new TreeModel();
    const clusters = await localforage.getItem("clusters")
    const initialParams = Array.from({length: [...new Set(Object.values(clusters))].length}, e=> Array(2).fill(1))
    const childObject = {name: `${deslugifyDoi(doi)}-[[1]]`, attributes: {doi: deslugifyDoi(doi), algParams: initialParams, nodeId: 1, pinned: false, cluster: clusters[doi], title: title}}
    const initialForceNodes = Array.from({length: initialParams.length}, (e, index) => ({id: `cluster-${index}`,
                                                                                         name: `Cluster ${index+1}`,
                                                                                         val: 8,
                                                                                         type: 'cluster',
                                                                                         nodeId: 0,
                                                                                         pinned: false
                                                                                       }))
    initialForceNodes.push({id: `node-1`,
                            name: `${deslugifyDoi(doi)}-[[1]]`,
                            doi: deslugifyDoi(doi),
                            title: title,
                            nodeId: 1,
                            val: 5,
                            type: 'paper',
                            pinned: false})
    const initialLinks = [{ "source": `cluster-${clusters[deslugifyDoi(doi)]}`, "target": "node-1"}]
    // const moreLinks = Array.from({length: initialParams.length - 1}, (e, index) => ({source: `cluster-${index}`, target: `cluster-${index + 1}`}))
    // initialLinks.push(...moreLinks)

    var root = tree.parse(childObject)
    localforage.setItem("nodeIdCounter", 1)
    localforage.setItem("traversalPath", root.model)
    localforage.setItem("activeNodeId", 1)
    localforage.setItem("algParams", initialParams)
    localforage.setItem("forceNodes", {nodes: initialForceNodes, links: initialLinks})
    localStorage.setItem("forceNodes", JSON.stringify({nodes: initialForceNodes, links: initialLinks}))

    if(pathSetter !== null){
      pathSetter(root.model)
      recentNodeSetter(1)
      algParamsSetter(initialParams)
      forceNodeSetter({nodes: initialForceNodes, links: initialLinks})
      clusterSetter(clusters)
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

  setter(root)
  return root
}
}

// TODO: will we use this?
// export async function checkIfPinned(nodeId){
//   const activeNodeId = await localforage.getItem("activeNodeId")
//   return activeNodeId === id
// }

export async function pinCurrentPaper(pathSetter, forceNodeSetter, pinStateSetter){
  const activeNodeId = await localforage.getItem("activeNodeId")
  const rootModel = await localforage.getItem("traversalPath")
  const tree = new TreeModel();
  const root = tree.parse(rootModel)
  const activeNode = root.first(function(node){
    return node.model.attributes.nodeId === activeNodeId
  })

  activeNode.model.attributes.pinned = !activeNode.model.attributes.pinned

  localforage.setItem('traversalPath', root.model)
  pathSetter(root.model)

  // Update the force nodes objects
  const forceNodes = await localforage.getItem("forceNodes")

  const index = forceNodes.nodes.findIndex(function(node){
    return node.nodeId === activeNodeId
  })

  if(~index){
    forceNodes.nodes[index] = {...forceNodes.nodes[index], pinned: !forceNodes.nodes[index].pinned}
  }

  localforage.setItem("forceNodes", forceNodes)
  forceNodeSetter(forceNodes)
  pinStateSetter(activeNode.model.attributes.pinned)
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
