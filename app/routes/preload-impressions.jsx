import { nearestNewPaper } from "~/models/backend-algorithms.server.js"
import { deslugifyDoi } from "~/utils/doi-manipulation"

export async function action({ request, params }){
  const formData = await request.formData();
  const traversalPath = formData.get('traversalPath')
  const mostRecentNode = formData.get('mostRecentNode')
  const doi = formData.get('doi')
  const algParams = formData.get('algParams')
  const clusters = formData.get('clusters')

  //TODO: preload impressions seems to fail a lot -- not sure if this is a remix thing

  let [[positiveImpression, positiveImpressionClusterIndex], [negativeImpression, negativeImpressionClusterIndex]] = await Promise.all([
    nearestNewPaper(doi, true, traversalPath, mostRecentNode, algParams, clusters),
    nearestNewPaper(doi, false, traversalPath, mostRecentNode, algParams, clusters)
  ])

  return {positiveImpression, positiveImpressionClusterIndex, negativeImpression, negativeImpressionClusterIndex}
}
