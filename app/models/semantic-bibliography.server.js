var doiRegex = require('doi-regex')
import { deslugifyDoi, doiToJournal } from "~/utils/doi-manipulation";
import { checkDoi } from "~/models/search.server";
import { getMetadataFromPaperId } from "~/models/metadata.server"
import { upsertPath } from "~/models/users.server"

import TreeModel from 'tree-model';
import FlatToNested from 'flat-to-nested';

export async function handleBibliographySearch(doiInput){
    const containsDoi = doiRegex().test(doiInput)
    if(containsDoi){
      const extractedDoi = doiInput.match(doiRegex())[0]
      const refData = await gatherAndFilterReferences(extractedDoi)
      const clusteredReferences = await clusterReferences(refData.unpackedRefList)
      const refDict = Object.assign(...refData.unpackedRefList.map((k, i) => ({[k]: refData.refList[i]})))

      return { case: "doi",
               doi: extractedDoi,
               references: refData.unpackedRefList,
               clusteredReferences: clusteredReferences,
               referencesMetadata: refData.refList,
               refDict: refDict
             }
    }
    else{
      return { case: "no-match", message: "We couldn't find a doi in your search string"}
    }
}

export async function gatherAndFilterReferences(doi){
  let url = `https://api.semanticscholar.org/graph/v1/paper/${doi}/references?fields=citationCount,externalIds,title,abstract,referenceCount,citationCount,influentialCitationCount,fieldsOfStudy,publicationDate,authors,publicationTypes`
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY
    }
  })
  let json = await res.json()
  let data = json['data']
  console.log("DATA", data[2]['citedPaper'])
  let refList = []
  for(let reference of data){
    refList.push({citationCount: reference['citedPaper']['citationCount'],
                  paperId: (reference['citedPaper']['externalIds'] && reference['citedPaper']['externalIds']["DOI"])
                                ? reference['citedPaper']['externalIds']["DOI"].toLowerCase()
                                : reference['citedPaper']['paperId'],
                  title: reference['citedPaper']['title'] ? reference['citedPaper']['title'] : "",
                  abstract: reference['citedPaper']['abstract'] ? reference['citedPaper']['abstract'] : "",
                  referenceCount: reference['citedPaper']['referenceCount'] ? reference['citedPaper']['referenceCount'] : null,
                  influentialCitationCount: reference['citedPaper']['influentialCitationCount'] ? reference['citedPaper']['influentialCitationCount'] : null,
                  fieldsOfStudy: reference['citedPaper']['fieldsOfStudy'] ? reference['citedPaper']['fieldsOfStudy'] : [],
                  publicationDate: reference['citedPaper']['publicationDate'] ? reference['citedPaper']['publicationDate'] : "",
                  authors: reference['citedPaper']['authors'] ? reference['citedPaper']['authors'] : [],
                })
  }
  let filteredList = refList.filter(function(ref){ return ref['citationCount'] !== null && ref['paperId'] !== null})
  let unpackedRefList = []
  for(let el of filteredList){
    unpackedRefList.push(el['paperId'])
  }
  return {unpackedRefList: unpackedRefList, refList: refList}
}

export async function warmupBibliographyMicroservice(){
    let data = {
      "command": "warmup"
    }
    let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddings?code=p41wjN5G4JXgPyMc0R5EvwSLWBE7h8iEQkwxMeP7Jbs8AzFuAIZSmw=="
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    })
    return res.json()
}

export async function clusterReferences(referencesList){
  let data = {
    "referencesList": referencesList
  }
  let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterBibliography?code=xYidRGDdtc7KbhB3ALeu6jn9virRYyUtlsmVs-er0iEhAzFuKuHGFA=="
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  })

  return res.json()
}

// ACTIVE NODE ID

// ALG PARAMS

// CLUSTERS

// FORCE NODES

// NODEIDCOUNTER

// SEARCH STRING

// TRAVERSAL PATH

// PATHNAME

// CLUSTER COUNTER

export async function processBibliography(references, bibliographyClusters, metadataMap, seedDOI, userId){
  // DATA STRUCTURE INITIATE
  var tree = new TreeModel();
  const algParams = Array.from({length: [...new Set(Object.values(bibliographyClusters))].length}, e=> Array(2).fill(1))
  const initialNodes = Array.from({length: algParams.length}, (e, index) => ({id: `cluster-${index}`,
                                                                                       name: `Cluster ${index+1}`,
                                                                                       val: 8,
                                                                                       type: 'cluster',
                                                                                       nodeId: 0,
                                                                                       pinned: false
                                                                                     }))
  const initialLinks = []
  const forceNodes = {nodes: initialNodes, links: initialLinks}
  const initialChildObject = {name: `removedNode`,
                              attributes: {}
                             }
  const root = tree.parse(initialChildObject)
  var mostRecentNode = root
  const searchString = seedDOI
  var clusterCounter = {}
  var nodeIdCounter = 1

  var parentId = undefined

  // ITERATION:
  for(let ref of references){


    // ALG PARAMS UPDATE (POSITIVE IF)
    algParams[bibliographyClusters[ref]][0] += 1

    // FORCE NODES UPDATE
    let newNode = {id: `node-${nodeIdCounter}`,
                     name: `${ref}`,
                     doi: ref,
                     title: metadataMap[ref]['title'],
                     val: 5,
                     nodeId: nodeIdCounter,
                     type: 'paper',
                     pinned: false}
    let newLink = { "source": `cluster-${bibliographyClusters[ref]}`, "target": `node-${nodeIdCounter}`}
    forceNodes.nodes.push(newNode)
    forceNodes.links.push(newLink)

    // TRAVERSAL PATH UPDATE
    const childObject = {name: `${ref}-[[${nodeIdCounter}]]`,
                         attributes: {doi: ref,
                                      algParams: algParams,
                                      nodeId: nodeIdCounter,
                                      pinned: false,
                                      cluster: bibliographyClusters[ref],
                                      metadata: metadataMap[ref]}}
    mostRecentNode = mostRecentNode.addChild(tree.parse(childObject))
    // CLUSTER COUNTER UPDATE
    clusterCounter[bibliographyClusters[ref]] = (clusterCounter[bibliographyClusters[ref]] || 0) + 1

    // NODE ID COUNTER UPDATE
    nodeIdCounter += 1
  }


  // FINAL DATA STRUCTURE CREATION
  // flatToNested = new FlatToNested({
  //   id: "name",
  //   parent: 'parent',
  //   children: 'children'
  // })
  // console.log("TRAVERSAL NODES:", traversalNodes)
  // const nestedPath = flatToNested.convert(traversalNodes)
  const firstChild = root.first(function(node){
    return node.model.attributes.nodeId === 1
  })
  const traversalPath = firstChild
  const activeNodeId = nodeIdCounter - 1
  const pathId = undefined
  const pathName = `Bibliography for ${seedDOI}`

  const upsertPathData = await upsertPath(
    userId,
    activeNodeId,
    JSON.stringify(algParams),
    JSON.stringify(bibliographyClusters),
    JSON.stringify(forceNodes),
    nodeIdCounter,
    searchString,
    JSON.stringify(traversalPath.model),
    "undefined",
    pathName,
    JSON.stringify(clusterCounter)
  )

  return {
    activeNodeId: activeNodeId,
    algParams: algParams,
    clusterCounter: clusterCounter,
    clusters: bibliographyClusters,
    forceNodes: forceNodes,
    nodeIdCounter: nodeIdCounter,
    searchString: searchString,
    traversalPath: traversalPath.model,
    pathId: upsertPathData.pathId,
    pathName: upsertPathData.pathName
  }
}
