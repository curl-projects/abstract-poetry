import { authenticator } from "~/models/auth.server";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/cookies.js";
import { getSession, commitSession } from "~/models/session.server"

export async function loader({ request }){

  let returnTo =
    (await returnCookie.parse(request.headers.get("Cookie"))) ?? "/";

  console.log("RETURN TO:", returnTo)
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: returnTo,
    failureRedirect: "/",
  });
};
