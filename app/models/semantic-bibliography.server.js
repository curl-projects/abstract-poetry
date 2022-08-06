var doiRegex = require('doi-regex')

export async function handleBibliographySearch(doiInput){
    const containsDoi = doiRegex().test(doiInput)
    if(containsDoi){
      const extractedDoi = doiInput.match(doiRegex())[0]
      const refData = await gatherAndFilterReferences(extractedDoi)
      const clusteredReferences = await clusterReferences(refData.unpackedRefList)
      return { case: "doi",
               doi: extractedDoi,
               references: refData.unpackedRefList,
               clusteredReferences: clusteredReferences,
               referencesMetadata: refData.refList}
    }
    else{
      return { case: "no-match", message: "We couldn't find a doi in your search string"}
    }
}

export async function gatherAndFilterReferences(doi){
  let url = `https://api.semanticscholar.org/graph/v1/paper/${doi}/references?fields=citationCount,externalIds,title,abstract,referenceCount,citationCount,influentialCitationCount,fieldsOfStudy,publicationDate,authors,publicationTypes`
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY
    }
  })
  let json = await res.json()
  let data = json['data']
  console.log("DATA", data[2]['citedPaper'])
  let refList = []
  for(let reference of data){
    refList.push({citationCount: reference['citedPaper']['citationCount'],
                  paperId: (reference['citedPaper']['externalIds'] && reference['citedPaper']['externalIds']["DOI"])
                                ? reference['citedPaper']['externalIds']["DOI"].toLowerCase()
                                : reference['citedPaper']['paperId'],
                  title: reference['citedPaper']['title'] ? reference['citedPaper']['title'] : "",
                  abstract: reference['citedPaper']['abstract'] ? reference['citedPaper']['abstract'] : "",
                  referenceCount: reference['citedPaper']['referenceCount'] ? reference['citedPaper']['referenceCount'] : null,
                  influentialCitationCount: reference['citedPaper']['influentialCitationCount'] ? reference['citedPaper']['influentialCitationCount'] : null,
                  fieldsOfStudy: reference['citedPaper']['fieldsOfStudy'] ? reference['citedPaper']['fieldsOfStudy'] : [],
                  publicationDate: reference['citedPaper']['publicationDate'] ? reference['citedPaper']['publicationDate'] : "",
                  authors: reference['citedPaper']['authors'] ? reference['citedPaper']['authors'] : [],
                })
  }
  let filteredList = refList.filter(function(ref){ return ref['citationCount'] !== null && ref['paperId'] !== null})
  let unpackedRefList = []
  for(let el of filteredList){
    unpackedRefList.push(el['paperId'])
  }
  return {unpackedRefList: unpackedRefList, refList: refList}
}

export async function warmupBibliographyMicroservice(){
    let data = {
      "command": "warmup"
    }
    let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddings?code=p41wjN5G4JXgPyMc0R5EvwSLWBE7h8iEQkwxMeP7Jbs8AzFuAIZSmw=="
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    })
    return res.json()
}

export async function clusterReferences(referencesList){
  let data = {
    "referencesList": referencesList
  }
  let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterBibliography?code=xYidRGDdtc7KbhB3ALeu6jn9virRYyUtlsmVs-er0iEhAzFuKuHGFA=="
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  })

  return res.json()
}
