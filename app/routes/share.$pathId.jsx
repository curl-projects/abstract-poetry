import { readPath } from "~/models/users.server.js"
import { useEffect, useState } from "react";
import * as localforage from "localforage";
import { useLoaderData, useFetcher } from "@remix-run/react";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"
export const loader = async ({ params, request }) => {
  const path = await readPath(params.pathId);
  return {path}
}

export default function ShareId(){
  const data = useLoaderData()
  const redirectFetcher = useFetcher()

  useEffect(()=>{
    console.log("DATA", data)
  }, [data])

  useEffect(()=>{
    if(data.path){
      localforage.setItem("activeNodeId", parseInt(data.path.activeNodeId));
      localforage.setItem("algParams", JSON.parse(data.path.algParams));
      localforage.setItem("clusters", JSON.parse(data.path.clusters));
      localforage.setItem("forceNodes", JSON.parse(data.path.forceNodes));
      localforage.setItem("nodeIdCounter", parseInt(data.path.nodeIdCounter));
      localforage.setItem("searchString", JSON.parse(data.path.searchString));
      localforage.setItem("traversalPath", JSON.parse(data.path.traversalPath));
      localforage.setItem("pathName", data.path.pathName);

      const tree = new TreeModel();
      const root = tree.parse(JSON.parse(data.path.traversalPath))

      const mostRecentNode = root.first(function(node){
        return node.model.attributes.nodeId === parseInt(data.path.activeNodeId)
      })
      console.log("MOST RECENT NODE:", mostRecentNode)
      const redirectURL = slugifyDoi(mostRecentNode.model.attributes.doi) || ''
      redirectFetcher.submit({redirectURL: `${redirectURL}?isPathRedirect=true`}, {
        method: "post",
        action: "/redirect-paths"
      })
    }
}, [data])

  return(
    <div>

    </div>
  )
}
