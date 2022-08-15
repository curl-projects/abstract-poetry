import { warmupMicroservice, warmupMicroservicev2 } from "~/models/microservices.server.js";

export async function action({ request }){
  const res = await warmupMicroservicev2()
  return { res }
}
