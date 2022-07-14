import { doiToCitation, generateBasicMetadata, extractPinnedDOIs } from "~/models/citations.server"

export async function action({ request }){
  const formData = await request.formData();
  const rootModel = formData.get('rootModel')
  const citationStyle = formData.get('citationStyle')

  // Get basic metadata from DOIs from the Redis store as a bandaid solution because
  // getting citations is too slow for now
  try{
    const citationsString = await generateBasicMetadata(rootModel)

    console.log("CITATIONS STRING", citationsString)
    // TODO: return an error if there are no pinned papers

    return new Response(citationsString, {
      headers: {
        "content-type": "text/plain",
        "content-disposition": "attachment; filename=citations.txt"
      }
    })
  }
  catch(e){
    console.error(e)
    return new Response(citationsString, {
      headers: {
        "content-type": "text/plain",
        "content-disposition": "attachment; filename=citations.txt"
      }
    })
  }
}
