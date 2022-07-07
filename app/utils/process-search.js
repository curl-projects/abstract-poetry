import { slugifyDoi } from "~/utils/doi-manipulation"

export async function handleSearch(searchString){
  // First, check if the search term is a DOI using regex
    // Look for a couple of different patterns so that you cover the web address versions etc.

    // If it is a DOI, then check if it exists in the Pinecone database using checkDOI

      // If it exists, then redirect to the endpoint: return redirect(`/${slugifyDoi(doi)}`)

      // If it doesn't exist, then call the Semantic Scholar API to find its metadata and embedding

        // If it exists, then pass its metadata in the request body to the paperId endpoint, and flag that the loader
        // shouldn't query the Redis cache for the information
          // ?? Where should we be loading the vector embedding? Don't want to pass it along the endpoint

        // If it doesn't exist in Semantic Scholar, then give up and return an error (for now)

    // If it's not a DOI, then pass the search string to a search API that's designed only to search PLoS

      // Find the DOI of the top result, and redirect to the appropriate page using return redirect(`/${slugifyDoi(doi)}`)




    // If it's not a DOI, then



  return null
}
