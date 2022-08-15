import { clusterDOIs, clusterDOIsv2 } from "~/models/microservices.server.js";
import { findMostRelatedScholarPaper, findRelevantReferences } from "~/models/search.server"

export async function action({ request, params }) {
  const formData = await request.formData();
  const doi = formData.get('doi');
  const keywordSearch = formData.get('keywordSearch');

  if (JSON.parse(keywordSearch)) {
    const paperId = formData.get('paperId')

    // here, we're finding the references of the selected paper, not the seedDOI. Is this better?
    const referencesList = await findRelevantReferences(paperId)

    const knn = await findMostRelatedScholarPaper(paperId)
    if (!knn.matches) {
      return { error: 'No closely related papers' }
    }
    const seedDOI = knn.matches[0].id
    const cluster = await clusterDOIs(knn.matches[0].id, referencesList)
    return { cluster, seedDOI }
  }

  const referencesList = formData.get('referencesList')

  const cluster = await clusterDOIs(doi, referencesList)
  return { cluster }
}
