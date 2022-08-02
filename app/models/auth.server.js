import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/models/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { upsertUser } from "~/models/users.server";
// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage
  // , {
  // sessionKey: "_session"
// }
);

async function handleSocialAuthCallback({ profile }) {
  // create user in your db here
  // profile object contains all the user data like image, displayName, id
  console.log("PROFILE:", profile.id, profile.emails[0].value)
  try{
    const user = await upsertUser(profile.id, profile.emails[0].value)
    console.log("USER:", user)
  }
  catch(error){
    console.log("USER ERROR", error)
  }

  return profile;
}

// Configuring Google Strategy
authenticator.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid email profile"],
    callbackURL: process.env.CALLBACK_URL
  },
  handleSocialAuthCallback
));
