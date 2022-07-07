import { getKNNFromDoi } from "~/models/embeddings.server"
import TreeModel from 'tree-model';

export async function nearestNewPaper(doi, impression, visitedPapers, traversedPapers, topK, nodeState){

  // TODO:
  // ALGORITHM:
    // The algorithm will read the most recent algorithm parameters from local storage
    // For clustering, it'll also need to extract a list of visited vectors from the tree (using DOIs as keys)

    // Clustering will also require storing all vectors somewhere that's easily accessible
      // This might actually be really difficult: they're too large for local storage
      // Maybe a Redis key specifically set up to host the currently active vectors for the current user?


  // the movement vector algorithm will replace the DOI input with a vector input,
  // and will use getKNNFromVector
  const knn = await getKNNFromDoi(doi, topK);

  if(knn.matches){
    const visitedPapersArray = visitedPapers.split(",")
    const tree = new TreeModel();
    const parsedNode = JSON.parse(nodeState)
    const root = tree.parse(JSON.parse(traversedPapers))

    // Find the current active node
    const node = root.first(function(node){
      return node.model.attributes.doi === parsedNode.attributes.doi
    })

    // use the current active node to generate a path of all visited papers
    const path = node.getPath()

    // find the first closest paper that hasn't already been visited
    const result = knn.matches.find(function(element){
      return path.filter(node => node.model.name === element.id).length === 0
    })

    // TODO
    // if the result is null (i.e. you've exhausted all of the most recent papers)
    // then expand the search and repeat until you have a result to return
    return result
  }
  return knn
}
