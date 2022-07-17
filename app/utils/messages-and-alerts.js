export function caseToMessage(expressionCase, searchString){
  switch(expressionCase){
    case "exact-doi-exists": return `Redirected you to the DOI '${searchString}'`
    case "closest-doi-match": return `We don't have the DOI '${searchString}' in our database. Here's our closest match.`
    case "closest-search-match": return `Here's the paper in our database most closely related to the search '${searchString}'`
    default: return "No case found"
  }
}
