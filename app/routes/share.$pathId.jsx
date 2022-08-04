import { readPath } from "~/models/users.server.js"
import { useEffect, useState } from "react";
import * as localforage from "localforage";
import { useLoaderData, useFetcher } from "@remix-run/react";
import TreeModel from 'tree-model';
import { slugifyDoi } from "~/utils/doi-manipulation"


export const loader = async ({ params, request }) => {
  const path = await readPath(params.pathId);

  const url = new URL(request.url)
  const search = new URLSearchParams(url.search)
  const tour = search.get("tour")
  return {path, tour}
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
      localforage.setItem("nodeIdCounter", parseInt(JSON.parse(data.path.forceNodes).links.length));
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
      const updateIndex = JSON.parse(data.path.clusters)[mostRecentNode.model.attributes.doi]
      redirectFetcher.submit({redirectURL: data.tour ? `${redirectURL}?isPathRedirect=true&tour=true&updateIndex=${updateIndex}&impression=true` :`${redirectURL}?isPathRedirect=true&updateIndex=${updateIndex}&impression=true`}, {
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
