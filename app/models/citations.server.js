import TreeModel from 'tree-model';
import { redis } from "~/models/redis.server"

export async function doiToCitation(doi, citationStyle){

  let url = `https://doi.org/${doi}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "text/x-bibliography", // this forces the result to be a citation
      "style": citationStyle
    }
  })
  return res
}

export async function extractPinnedDOIs(rootModel){
  const tree = new TreeModel();
  const root = tree.parse(JSON.parse(rootModel))

  // Push the DOIs of all pinned papers into a list
  var doiList = []
  root.walk(function(node){
    if(node.model.attributes.pinned){
      doiList.push(node.model.attributes.doi)
    }
  })
  return doiList
}

export async function generateBasicMetadata(rootModel){
  const readingListDOI = await extractPinnedDOIs(rootModel)
  console.log("READING LIST DOI:", readingListDOI && readingListDOI.length)
  if(!readingListDOI.length){
    throw "No pinned papers!"
    console.log('Executing')
  }
  const metadataArray = []
  for(let doi of readingListDOI){
    // TODO: use batching or pipelining here instead
    let metadata = await redis.get(doi)
    metadataArray.push(`doi:${doi}, title:${metadata.title}`)
  }
  return metadataArray.join('\n')
}
