import { authenticator } from "~/models/auth.server.js";
import { readPaths } from "~/models/users.server";

export async function action(){
  const user = await authenticator.isAuthenticated(request)
  const userId = user.id

  const paths = await readPaths(userId)

  return paths
}
