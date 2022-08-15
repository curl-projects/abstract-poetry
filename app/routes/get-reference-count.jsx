import { getReferenceCount } from "~/models/semantic-bibliography.server";
var doiRegex = require('doi-regex')

export async function action({ request }){
  const formData = await request.formData();
  const doi = formData.get('doi')

  const containsDoi = doiRegex().test(doi)
  if(containsDoi){
    const extractedDoi = doi.match(doiRegex())[0]
    const referenceCount = await getReferenceCount(extractedDoi)
    return { referenceCount }
  }
  else{
    const referenceCount = {
      error: "Does not contain DOI"
    }
    return { referenceCount }
  }
}
