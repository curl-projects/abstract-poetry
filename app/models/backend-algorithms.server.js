import { getKNNFromDoi } from "~/models/embeddings.server"


export async function nearestNewPaper(doi, impression, visitedPapers, topK){
  console.log("DOI:", doi)
  const knn = await getKNNFromDoi(doi, topK);

  if(knn.matches){
    const visitedPapersArray = visitedPapers.split(",")
    const result = knn.matches.filter(function(x){return !visitedPapersArray.includes(x.id)})
    return result
  }
  return knn
}
