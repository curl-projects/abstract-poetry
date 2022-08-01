import { PrismaClient } from "@prisma/client";

let db;

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}

export { db };

// USER DATA:
  // Primary user data will be stored into cockroachdb
  // There's a many-to-one relationship between the user model amd a TraversalPaths model
  // The traversalPaths associated with a user will contain all of the Redis keys used to store the actual path
  // These are retrieved and loaded into localstorage when the user initiates a session


  // SAVING:
    // Initially, we set up manual saves with Command S and a Save button
