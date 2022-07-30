import { authenticator } from "~/models/auth.server.js";

export const action = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
