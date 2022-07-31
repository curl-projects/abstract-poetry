import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { createCookie } from "@remix-run/node"; // or cloudflare/deno

//
// async function login(request) {
//   // from the URL, get the returnTo search param
//   let url = new URL(request.url);
//   let returnTo = url.searchParams.get("returnTo");
//
//   try {
//     // call authenticate as usual, in successRedirect use returnTo or a fallback
//     return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
//       successRedirect: returnTo ?? "/",
//       failureRedirect: "/",
//     });
//   } catch (error) {
//     // here we catch anything authenticator.authenticate throw, this will
//     // include redirects
//     // if the error is a Response and is a redirect
//     if (error instanceof Response && error.redirected) {
//       // we need to append a Set-Cookie header with a cookie storing the
//       // returnTo value
//       error.headers.append(
//         "Set-Cookie",
//         await returnToCookie.serialize(returnTo)
//       );
//     }
//     throw error;
//   }
// }

export const returnCookie = createCookie("returnToCookie", {
  // all of these are optional defaults that can be overridden at runtime
  maxAge: 604_800,
});


export const action = async ({ request }) => {
  // initiating authentication using Google Strategy
  const requestClone = request.clone();
  const formData = await requestClone.formData();
  let url = formData.get('url')

  const cookieHeader = request.headers.get("Cookie")
  const returnToCookie =
    ( await returnCookie.parse(cookieHeader) || {})

  returnToCookie.url = url

  const headers = new Headers();

  request.headers.set(
    "cookie",
    await returnCookie.serialize(returnToCookie)
  )

  console.log("REQUEST AUTH.GOOGLE", request)
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    // TODO: redirect to previous url
    successRedirect: `${url}`,
    failureRedirect: `/auth.google?redirectTo=${url}`,
  });
};
