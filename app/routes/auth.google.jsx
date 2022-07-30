import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";

export const action = async ({ request }) => {
  // initiating authentication using Google Strategy

  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    // TODO: redirect to previous url
    successRedirect: "/search",
    failureRedirect: "/",
  });
};
