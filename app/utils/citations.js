export async function doiToCitation(doi, citationStyle){

  // TODO: create a citationStyle drop-down with appropriate names for each style

  let url = `https://doi.org/${doi}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "text/x-bibliography",
      "style": citationStyle,
    }
  })
  return res
}
