import { warmupBibliographyMicroservice } from "~/models/semantic-bibliography.server.js";

export async function action({ request }){
  const res = await warmupBibliographyMicroservice()
  return { res }
}
