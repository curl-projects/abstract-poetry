import { Redis } from "@upstash/redis";
import TreeModel from 'tree-model';

const redis = new Redis({
  url: 'https://global-sterling-marlin-30591.upstash.io',
  token: 'AXd_ASQgOTZkNTJkOGUtNzM3MC00YzRlLThjN2EtOTI3OTljYTc4YTZlODZjNmU1MjMxMWQ1NGRlMGFmMWJmZDdjMjFkNTIwNTY=',
})

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
  const metadataArray = []
  for(let doi of readingListDOI){
    // TODO: use batching or pipelining here instead
    let metadata = await redis.get(doi)
    metadataArray.push(`doi:${doi}, title:${metadata.title}`)
  }
  return metadataArray.join('\n')
}
