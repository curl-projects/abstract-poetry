import { slugifyDoi } from "~/utils/doi-manipulation"
import { redirect } from "@remix-run/node"
// import { redis } from "~/models/redis.server"

var doiRegex = require('doi-regex')
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "global-sterling-marlin-30591.upstash.io",
  token: "AXd_ASQgOTZkNTJkOGUtNzM3MC00YzRlLThjN2EtOTI3OTljYTc4YTZlODZjNmU1MjMxMWQ1NGRlMGFmMWJmZDdjMjFkNTIwNTY="
})

export async function checkDoi(doi){
  let exists = await redis.exists(doi)
  return exists
}

export async function handleSearch(searchString){
  // First, check if the search term is a DOI using regex
    const containsDoi = doiRegex().test(searchString)

    // // If it is a DOI, then check if it exists in the Pinecone database
    if(containsDoi){
      let extractedDoi = searchString.match(doiRegex())[0]
      const existsInDB = await checkDoi(extractedDoi)

      if(existsInDB){
        return { action: 'redirect', case: "exact-doi-exists", message: `Redirected you to the DOI '${extractedDoi}'`, doiString: slugifyDoi(extractedDoi)}
      }
      else{
        // Find the closest DOI to the one that was entered that is in our database\

        // TODO: Improve this: really bad search
        let url=`http://api.crossref.org/works?query=${searchString}&filter=prefix:10.1371&select=DOI&rows=1`

        const response = await fetch(url, {
          method: "GET"
        })

        let jsonResponse = await response.json()

        if(jsonResponse.message.items.length === 0){
          // If the search doesn't return any close matches
          return { action: 'error', case: "not-in-db", message: `We couldn't find any close matches in our database to the DOI '${extractedDoi}'.`, doiString: ""}
        }
        else{
          return { action: 'redirect', case: "closest-doi-match", message: `We don't have the DOI '${extractedDoi}' in our database. Here's our closest match.`, doiString: slugifyDoi(jsonResponse.message.items[0].DOI) }
        }
      }
    }
    else{
      // If the searchString doesn't contain a DOI
      let url=`http://api.crossref.org/works?query=${searchString}&filter=prefix:10.1371&select=DOI&rows=1`
      // let url=`http://api.crossref.org/works?query=${searchString}&filter=prefix:10.1371&select=DOI,subject,title&rows=20`

      const response = await fetch(url, {
        method: "GET"
      })

      let jsonResponse = await response.json()

      if(jsonResponse.message.items.length === 0){
        return { action: 'error', case: "no-search-matches", message: `We couldn't find any papers in our database closely related to the search '${searchString}'`, doiString: "" }
      }
      else{
        return { action: 'redirect', case: "closest-search-match", message: `Here's the paper in our database most closely related to the search '${searchString}'`, doiString: slugifyDoi(jsonResponse.message.items[0].DOI) }
        // return { action: 'error', case: "closest-search-match", items: jsonResponse.message.items, message: `Here's the paper in our database most closely related to the search '${searchString}'`, doiString: slugifyDoi(jsonResponse.message.items[0].DOI) }
      }
    }
}
