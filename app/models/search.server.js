import { slugifyDoi } from "~/utils/doi-manipulation"
import { redirect } from "@remix-run/node"
import { getKNNFromVector } from "~/models/embeddings.server"
import { redis } from "~/models/redis.server"

var doiRegex = require('doi-regex')

export async function checkDoi(doi){
  let exists = await redis.exists(doi)
  return exists
}

function optimiseSearchString(searchString){
  let lowercaseString = searchString.toLowerCase();
  let plusString = lowercaseString.replace(" ", "+")
  return plusString
}


export async function handleSearch(searchString){
  // First, check if the search term dis a DOI using regex
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


export async function handleSearchv2(searchString){
  // First, check if the search term dis a DOI using regex
    const containsDoi = doiRegex().test(searchString)

    // // If it is a DOI, then check if it exists in the Pinecone database
    if(containsDoi){
      const extractedDoi = searchString.match(doiRegex())[0]
      const existsInDB = await checkDoi(extractedDoi)
      if(existsInDB){
        return { action: 'redirect', case: "exact-doi-exists", message: `Redirected you to the DOI '${extractedDoi}'`, doiString: slugifyDoi(extractedDoi)}
      }
      else{
        // Find the closest DOI to the one that was entered that is in our database
        const extractedDoi = searchString.match(doiRegex())[0]

        // This ensures search consistency between keyword and paper search, because in both cases we're using the seed paper, rather than the closest match in our db`
        const referencesList = await findRelevantReferences(extractedDoi)
        // console.log("REFERENCES LIST!", referencesList)
        // console.log("REFERENCES LIST LENGTH!", referencesList.length)

        let knn = await findMostRelatedScholarPaper(extractedDoi)
        console.log("KNN", knn)
        if(!knn.matches){
          // If the search doesn't return any close matches
          return { action: 'error', case: "not-in-db", message: `We couldn't find any close matches in our database to the DOI '${extractedDoi}'.`, doiString: ""}
        }
        else{
          return { action: 'redirect', case: "closest-doi-match",
                   message: `We don't have the DOI '${extractedDoi}' in our database. Here's our closest match.`,
                   doiString: slugifyDoi(knn.matches[0].id),
                   referencesList: JSON.stringify(referencesList)
                 }
        }
      }
    }
    else{
      // If the searchString doesn't contain a DOI
      let jsonResponse = await handleScholarKeywordSearch(searchString, limit=10)
      if(jsonResponse.error || jsonResponse.data.length === 0){
        return { action: 'error', case: "no-search-matches", message: `We couldn't find any papers in our database closely related to the search '${searchString}'`, doiString: "" }
      }
      else {
        return { action: 'select-papers', case: "closest-search-match", message: `Here's the paper in our database most closely related to the search '${searchString}'`, doiString: null, doiList: jsonResponse.data }
      }
    }
}


export async function findRelevantReferences(paperId){
    let url = `https://api.semanticscholar.org/graph/v1/paper/${paperId}/references?fields=citationCount`
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY
      }
    })
    let json = await res.json()
    let data = json['data']

    let refList = []
    for(let reference of data){
      refList.push({citationCount: reference['citedPaper']['citationCount'], referenceId: reference['citedPaper']['paperId']})
    }
    let filteredList = refList.filter(function(ref){ return ref['citationCount'] !== null && ref['paperId'] !== null})
    let sortedRefList = filteredList.sort(function(a, b){ return (b.citationCount) - (a.citationCount)})
    let slicedList = sortedRefList.slice(0, 5)
    let unpackedRefList = []
    for(let el of slicedList){
      unpackedRefList.push(el['referenceId'])
    }
    return unpackedRefList
}

export async function handleScholarKeywordSearch(searchString, limit=1){
  // Return the fifteen papers most closely related to the search string
  let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${optimiseSearchString(searchString)}&limit=${limit}&fields=publicationDate,title,authors,journal`
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY
    }
  })
  return res.json()
}

export async function findMostRelatedScholarPaper(paperId){
  let url = `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=embedding`
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY
    }
  })

  const jsonResponse = await res.json();

  const embedding = jsonResponse['embedding']['vector']

  let relatedPapers = await getKNNFromVector(embedding, topK=1)

  return relatedPapers
}
