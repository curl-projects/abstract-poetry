import { nearestNewPaper } from "~/models/backend-algorithms.server.js"
import { deslugifyDoi } from "~/utils/doi-manipulation"

export async function action({ request, params }){
  const formData = await request.formData();
  const traversalPath = formData.get('traversalPath')
  const mostRecentNode = formData.get('mostRecentNode')
  const doi = formData.get('doi')

  let [positiveImpression, negativeImpression] = await Promise.all([
    nearestNewPaper(doi, true, traversalPath, 5, mostRecentNode),
    nearestNewPaper(doi, false, traversalPath, 5, mostRecentNode)
  ])

  return {positiveImpression, negativeImpression}
}
//
// <Link to={negativeDOI ? `/${slugifyDoi(negativeDOI)}` : "/"}
//       ref={negativeDOI ? negativeSubmitRef : inactiveRef}
//       onClick={() => negativeSubmitRef.current.click()}
//        />
// <Link to={positiveDOI ? `/${slugifyDoi(positiveDOI)}` : "/"} ref={positiveDOI ? positiveSubmitRef : inactiveRef} />
