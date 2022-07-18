import { clusterDOIs } from "~/models/microservices.server.js";
import { findMostRelatedScholarPaper } from "~/models/search.server"

export async function action({ request, params }){
  const formData = await request.formData();
  const doi = formData.get('doi');
  const keywordSearch = formData.get('keywordSearch');

  if(JSON.parse(keywordSearch)){
    const paperId = formData.get('paperId')
    const knn = await findMostRelatedScholarPaper(paperId)
    if(!knn.matches){
      return {error: 'No closely related papers'}
    }
    const seedDOI = knn.matches[0].id
    const cluster = await clusterDOIs(knn.matches[0].id)
    return {cluster, seedDOI}
  }

  const cluster = await clusterDOIs(doi)
  return {cluster}
}
