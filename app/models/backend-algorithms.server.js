import { getKNNFromDoi } from "~/models/embeddings.server"
import TreeModel from 'tree-model';
import * as localforage from "localforage";
import { beta } from "jstat"

async function updateParams(doi, impression, clusters, parameters){
  // Find the cluster that the doi belongs to
  // const row = clusters.find(cluster => cluster.some(doiString => doiString === doi))
  // // Update the associated parameter value
  // const clusterIndex = clusters.indexOf(row)

  const clusterIndex = clusters[`${doi}`]
  // NOTE: there's a frontend version of this in the visited-papers algorithm that you should update as well
  // TODO: abstract this away into a single function
  if(impression){
      parameters[clusterIndex][0] += 1
  }
  else{
    parameters[clusterIndex][1] += 1
  }
  return [parameters, clusterIndex]
}

async function findNextPaper(updatedParams, doi, nodeState, traversedPapers, clusters) {
  // Uses Thompson Sampling to find the next paper to visit
  const samples = updatedParams.map(param => beta.sample(param[0], param[1]))
  const clusterIdx = samples.indexOf(Math.max(...samples))
  

  // next cluster 
  // TODO: ideally we should have a doi -> cluster map and a cluster -> doi[] map 
  const nextCluster = Object.fromEntries(Object.entries(clusters).filter(([k, v]) => v == clusterIdx));

  // Reusing existing code for this. Not sure if this is the best way to do this.
  const tree = new TreeModel();
  const root = tree.parse(JSON.parse(traversedPapers))
  var visitedDois = []
  root.walk({ strategy: 'pre' }, (e) => visitedDois.push(e.model.attributes.doi))

  // Filter nextCluster to only include papers that haven't been visited
  const possibleDois = Object.keys(nextCluster).filter(doi => !visitedDois.includes(doi))
  
  // If there are no papers, query the nearest neighbor
  if (possibleDois.length === 0) {
    const knn = await getKNNFromDoi(doi, 5);

    if (knn.matches) {
      const nodeId = JSON.parse(nodeState)
      // Find the current active node
      const node = root.first(function (node) {
        return node.model.attributes.nodeId === nodeId
      })

      const path = node.getPath()
      // find the first closest paper that hasn't already been visited
      const result = knn.matches.find(function (element) {
        return path.filter(node => node.model.attributes.doi === element.id).length === 0
      })

      // TODO
      // if the result is null (i.e. you've exhausted all of the most recent papers)
      // then expand the search and repeat until you have a result to return
      // The exact implementation depends on the
      return result
    }
  }
  return {id: possibleDois[0], }
}

// TODO: remove the null default values once the codebase is refactored
export async function nearestNewPaper(doi, impression, traversedPapers, nodeState, algParams=null, clusters=null){
  let [updatedParams, clusterIndex] = await updateParams(doi, impression, JSON.parse(clusters), JSON.parse(algParams))

  let result = await findNextPaper(updatedParams, doi, nodeState, traversedPapers, JSON.parse(clusters))

  return [result, clusterIndex]
}
