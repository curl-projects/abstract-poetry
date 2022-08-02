import { authenticator } from "~/models/auth.server.js";
import { readPaths } from "~/models/users.server";

export async function loader({ request }){
  console.log("HELLO")
  const user = await authenticator.isAuthenticated(request)
  const userId = user.id
  console.log("USER ID:", userId)
  const paths = await readPaths(userId)
  console.log("USER ID:", userId)
  return paths
}
