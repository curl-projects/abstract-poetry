import { doiToCitation } from "~/models/citations.server"

export async function action({ request }){
  const formData = await request.formData();
  const doi = formData.get('doi')
  const citationStyle = formData.get('citationStyle')
  const citation = await doiToCitation(doi, citationStyle)
  return new Response(citation, {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  })
}
