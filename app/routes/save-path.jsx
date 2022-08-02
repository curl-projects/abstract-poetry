import { upsertPath } from "~/models/users.server"
import { authenticator } from "~/models/auth.server.js";

export async function action({ request }){
  const formData = await request.formData();
  const activeNodeId = formData.get('activeNodeId')
  const algParams = formData.get('algParams')
  const clusters = formData.get('clusters')
  const forceNodes = formData.get('forceNodes')
  const nodeIdCounter = formData.get('nodeIdCounter')
  const searchString = formData.get('searchString')
  const traversalPath = formData.get('traversalPath')
  const pathId = formData.get('pathId')
  const user = await authenticator.isAuthenticated(request)
  const userId = user.id

  console.log("CALLING UPSERT PATH DATA")
  console.log("PATH ID:", pathId)
  const upsertPathData = await upsertPath(
    userId,
    parseInt(activeNodeId),
    algParams,
    clusters,
    forceNodes,
    parseInt(nodeIdCounter),
    searchString,
    traversalPath,
    pathId
  )
  return upsertPathData
}
