import { authenticator } from "~/models/auth.server";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/routes/auth.google"

export async function loader({ request }){
  console.log("REQUEST:", request)
  // let returnTo =
  //  (await returnCookie.parse(request.headers.get("Cookie"))) ?? "/";

  let response = await request.headers.get("cookie")

  console.log("RESPONSE:", await returnCookie.parse(response))

  // console.log("RETURN TO:", returnTo)
  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/",
    failureRedirect: '/'
  });
};
