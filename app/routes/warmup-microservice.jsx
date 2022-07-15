import { warmupMicroservice } from "~/models/microservices.server.js";

export async function action({ request }){
  const res = await warmupMicroservice()
  return { res }
}
