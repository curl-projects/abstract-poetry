import { deslugifyDoi, doiToJournal } from "~/utils/doi-manipulation";
import TreeModel from 'tree-model';



export function processBibliography(bibliographyClusters, metadataMap){
  // DATA STRUCTURE INIT
  const algParams = Array.from({length: [...new Set(Object.values(bibliographyClusters))].length}, e=> Array(2).fill(1))
  const initialNodes = Array.from({length: initialParams.length}, (e, index) => ({id: `cluster-${index}`,
                                                                                       name: `Cluster ${index+1}`,
                                                                                       val: 8,
                                                                                       type: 'cluster',
                                                                                       nodeId: 0,
                                                                                       pinned: false
                                                                                     }))
  const initialLinks = [{ "source": `cluster-${clusters[deslugifyDoi(doi)]}`, "target": "node-1"}]
  const forceNodes = {nodes: initialNodes, links: initialLinks}
  const nodeIdCounter = 1

  // ITERATION:
  for(let [key, value] of Object.entries(bibliographyClusters)){
    // FIND RELEVANT METADATA
    const metadata = (doiToJournal(key) === "Unknown Journal") ? metadataMap[key] :
    if(doiToJournal(key) === "Unknown Journal"){
    }

    // ALG PARAMS UPDATE
    algParams[value][0] += 1

    // FORCE NODES UPDATE
    let newNode = {id: `node-${nodeIdCounter}`,
                     name: `${key}`,
                     doi: key,
                     title: bibliographyToTitle[key],
                     val: 5,
                     nodeId: nodeIdCounter,
                     type: 'paper',
                     pinned: false}
    let newLink = { "source": `cluster-${value}`, "target": `node-${nodeIdCounter}`}
    forceNodes.nodes.push(newNode)
    forceNodes.links.push(newLink)

    // TRAVERSAL PATH UPDATE
    const childObject = {name: `${key}-[[${nodeIdCounter}]]`,
                         attributes: {doi: key,
                                      algParams: algParams,
                                      nodeId: nodeIdCounter,
                                      pinned: false,
                                      cluster: value,
                                      metadata: metadata}}

    // NODE ID COUNTER UPDATE
    nodeIdCounter += 1
  }
  // FINAL DATA STRUCTURE CREATION
  const activeNodeId = nodeIdCounter

  return null
}
