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
  const root = tree.parse(rootModel)

  // Push the DOIs of all pinned papers into a list
  let doiList = []
  nodeList = root.walk(function(node){
    if(node.model.attributes.pinned){
      doiList.push(node.model.attributes.doi)
    }
  })

  return doiList
}

export async function generateBasicMetadata(rootModel){
  const readingListDOI = await extractPinnedDOIs(rootModel)

  let metadataArray = []
  for(let doi of readingListDOI){
    // TODO Maybe replace this so it uses a batch get request instead
    let metadata = await redis.get(doi)
    let metadataJSON = JSON.parse(metadata)
    metadataArray.push(`doi:${doi}, title:${metadataJSON.title}`)
  }
  return "\n".join(metadataArray)
}
