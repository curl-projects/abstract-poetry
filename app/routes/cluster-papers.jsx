import { clusterDOIs } from "~/models/backend-algorithms.server.js";

export async function action({ request, params }){
  const formData = await request.formData();
  const doi = formData.get('doi');

  const cluster = await clusterDOIs(doi)

  return {cluster}
}
