import { authenticator } from "~/models/auth.server";
import { SocialsProvider } from "remix-auth-socials";

export const loader = ({ request }) => {
  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/search",
    failureRedirect: "/",
  });
};
