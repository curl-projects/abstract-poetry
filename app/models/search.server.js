import { slugifyDoi } from "~/utils/doi-manipulation"
import { Redis } from "@upstash/redis"
import { redirect } from "@remix-run/node"

var doiRegex = require('doi-regex')
const redis = new Redis({
  url: 'https://global-sterling-marlin-30591.upstash.io',
  token: 'AXd_ASQgOTZkNTJkOGUtNzM3MC00YzRlLThjN2EtOTI3OTljYTc4YTZlODZjNmU1MjMxMWQ1NGRlMGFmMWJmZDdjMjFkNTIwNTY=',
})

export async function checkDoi(doi){
  let exists = await redis.exists(doi)
  return exists
}

export async function handleSearch(searchString){
  // First, check if the search term is a DOI using regex
    // Look for a couple of different patterns so that you cover the web address versions etc.
    const containsDoi = doiRegex().test(searchString)
    // // If it is a DOI, then check if it exists in the Pinecone database using checkDOI
    if(containsDoi){
      let extractedDoi = searchString.match(doiRegex())[0]
      console.log("DOI GROUPS:", extractedDoi)
      const existsInDB = await checkDoi(extractedDoi)
    //
    //   // If it exists, then redirect to the endpoint: return redirect(`/${slugifyDoi(doi)}`)
      if(existsInDB){
        return { action: 'redirect', case: "exact-doi-exists", message: `Redirected you to the DOI '${extractedDoi}'`, doiString: slugifyDoi(extractedDoi)}
      }
      else{
        // Find the closest DOI to the one that was entered that is in our database\

        // TODO: Improve this: really bad search
        let url=`http://api.crossref.org/works?query=${searchString}&filter=prefix:10.1371&select=DOI&rows=1`
        console.log("URL:", url)

        const response = await fetch(url, {
          method: "GET"
        })

        let jsonResponse = await response.json()
        if(jsonResponse.message.items.length === 0){
          return { action: 'error', case: "not-in-db", message: `We couldn't find any close matches in our database to the DOI '${extractedDoi}'.`, doiString: ""}
        }
        else{
          return { action: 'redirect', case: "closest-doi-match", message: `We don't have the DOI '${extractedDoi}' in our database. Here's our closest match.`, doiString: slugifyDoi(jsonResponse.message.items[0].DOI) }
        }
      }
    }
    else{
      let url=`http://api.crossref.org/works?query=${searchString}&filter=prefix:10.1371&select=DOI&rows=1`
      console.log("URL:", url)

      const response = await fetch(url, {
        method: "GET"
      })

      let jsonResponse = await response.json()

      if(jsonResponse.message.items.length === 0){
        return { action: 'error', case: "no-search-matches", message: `We couldn't find any papers in our database closely related to the search '${searchString}'`, doiString: "" }
      }
      else{
        return { action: 'redirect', case: "closest-search-match", message: `Here's the paper in our database most closely related to the search '${searchString}'`, doiString: slugifyDoi(jsonResponse.message.items[0].DOI) }
      }
    }
}
