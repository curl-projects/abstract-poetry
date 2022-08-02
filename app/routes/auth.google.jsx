import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/cookies.js";
import { getSession, commitSession } from "~/models/session.server"


export let action = ({ request }) => login(request);
export let loader = ({ request }) => login(request);


async function login(request) {
  let url = new URL(request.url);
  const search = new URLSearchParams(url.search)
  const returnTo = search.get("returnTo");

  console.log("RETURN TO:", returnTo)
  try {
    return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
      // TODO: redirect to previous url
      successRedirect: returnTo ?? "/search",
      failureRedirect: "/",
    });
  }
  catch (error) {
    if (!returnTo) throw error;
    if (error instanceof Response && isRedirect(error)) {
      error.headers.append(
        "Set-Cookie",
        await returnCookie.serialize(returnTo)
      );
      return error;
    }
    throw error;
  }
}

function isRedirect(response){
  if (response.status < 300 || response.status >= 400) return false;
  return response.headers.has("Location")
}
