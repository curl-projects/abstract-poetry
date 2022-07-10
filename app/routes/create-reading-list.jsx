import { doiToCitation, extractPinnedDOIs } from "~/models/citations.server"


export async function action({ request }){
  const formData = await request.formData();
  const rootModel = formData.get('rootMOdel')
  const citationStyle = formData.get('citationStyle')

  // Get basic metadata from DOIs from the Redis store as a bandaid solution because
  // getting citations is too slow for now

  const citationsString = await generateBasicMetadata(rootModel)

  // CODE THAT WILL BE USED LATER TO GENERATE CITATIONS
  // const citation = await doiToCitation(doi, citationStyle);
  // const text = await citation.text();
  // console.log("CITATION TEXT:", text);

  return new Response(citationsString, {
    headers: {
      "content-type": "text/plain",
      "content-disposition": "attachment; filename=feedback.txt"
    }
  })
}
