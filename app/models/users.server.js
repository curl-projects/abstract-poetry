import { db } from "~/models/db.server";

export async function upsertUser(id, email){
  const upsertUser = await db.user.upsert({
    where: {
      userId: id
    },
    update: {},
    create: {
      userId: id,
      emailAddress: "placeholder"
    }
  });

  console.log("UPSERT USER!:", upsertUser)
  return upsertUser
}
