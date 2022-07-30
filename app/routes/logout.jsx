import { authenticator } from "~/models/auth.server.js";

export const action = async ({ request }) => {
  const requestClone = request.clone();
  const formData = await requestClone.formData();
  let url = formData.get('url')

  await authenticator.logout(request, { redirectTo: `${url}` });
};
