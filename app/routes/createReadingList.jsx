import { doiToCitation } from "~/models/citations.server"

export async function action({ request }){
  const formData = await request.formData();
  const doi = formData.get('doi')
  const citationStyle = formData.get('citationStyle')

  const citation = await doiToCitation(doi, citationStyle);
  const text = await citation.text();
  console.log("CITATION TEXT:", text);
  return new Response(text, {
    headers: {
      "content-type": "text/plain",
      "content-disposition": "attachment; filename=feedback.txt"
    }
  })
}
