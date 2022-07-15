import { getKNNFromDoi } from "~/models/embeddings.server"
import TreeModel from 'tree-model';
import * as localforage from "localforage";

async function updateParams(doi, impression, clusters, parameters){
  // Find the cluster that the doi belongs to
  // const row = clusters.find(cluster => cluster.some(doiString => doiString === doi))
  // // Update the associated parameter value
  // const clusterIndex = clusters.indexOf(row)

  const clusterIndex = clusters[`${doi}`]
  console.log("CLUSTERINDEX:", clusterIndex)
  // NOTE: there's a frontend version of this in the visited-papers algorithm that you should update as well
  // TODO: abstract this away into a single function
  if(impression){
      parameters[clusterIndex][0] += 1
  }
  else{
    parameters[clusterIndex][0] -= 1
  }
  return [parameters, clusterIndex]
}

async function findNextPaper(updatedParams, doi, nodeState, traversedPapers, topK=5){
  const knn = await getKNNFromDoi(doi, topK);

  if(knn.matches){
    const tree = new TreeModel();
    const nodeId = JSON.parse(nodeState)
    const root = tree.parse(JSON.parse(traversedPapers))

    // Find the current active node
    const node = root.first(function(node){
      return node.model.attributes.nodeId === nodeId
    })

    path = node.getPath()

    // find the first closest paper that hasn't already been visited
    const result = knn.matches.find(function(element){
      return path.filter(node => node.model.attributes.doi === element.id).length === 0
    })

    // TODO
    // if the result is null (i.e. you've exhausted all of the most recent papers)
    // then expand the search and repeat until you have a result to return
    // The exact implementation depends on the
    return result
  }
  return knn
}

// TODO: remove the null default values once the codebase is refactored
export async function nearestNewPaper(doi, impression, traversedPapers, nodeState, algParams=null, clusters=null){
  let [updatedParams, clusterIndex] = await updateParams(doi, impression, JSON.parse(clusters), JSON.parse(algParams))

  let result = await findNextPaper(updatedParams, doi, nodeState, traversedPapers)

  return [result, clusterIndex]
}
