import { db } from "~/models/db.server";

export async function upsertUser(profile){
  const upsertUser = await db.user.upsert({
    where: {
      id: profile.id
    },
    update: {},
    create: {
      userId: profile.id,
      emailAddress: "placeholder"
    }
  });

  return upsertUser
}
