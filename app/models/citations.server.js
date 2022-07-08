export async function doiToCitation(doi, citationStyle){
  const citationStyleMap = {
    "APA": "apa",
    "MLA": "",
    "Chicago": "",
    "Harvard": ""
  }

  let url = `https://doi.org/${doi}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "text/x-bibliography",
      "style": citationStyle,
    }
  })
  return JSON.stringify(res)
}
