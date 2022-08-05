import { db } from "~/models/db.server";

export async function upsertUser(id, email){
  const upsertUser = await db.user.upsert({
    where: {
      userId: id
    },
    update: {
    },
    create: {
      userId: id,
      emailAddress: email
    }
  });
  return upsertUser
}

export async function upsertPath(userId,
                                 activeNodeId,
                                 algParams,
                                 clusters,
                                 forceNodes,
                                 nodeIdCounter,
                                 searchString,
                                 traversalPath,
                                 pathId,
                                 pathName,
                                 clusterCounter
                                ){

    const upsertPath = await db.traversalPath.upsert({
      where: {
        pathId: pathId === "undefined" ? "0" : pathId
      },
      update: {
        activeNodeId: activeNodeId,
        algParams: algParams,
        clusters: clusters,
        forceNodes: forceNodes,
        nodeIdCounter: nodeIdCounter,
        searchString: searchString,
        traversalPath: traversalPath,
        pathName: pathName,
        clusterCounter: clusterCounter
      },
      create: {
        userId: userId,
        activeNodeId: activeNodeId,
        algParams: algParams,
        clusters: clusters,
        forceNodes: forceNodes,
        nodeIdCounter: nodeIdCounter,
        searchString: searchString,
        traversalPath: traversalPath,
        pathName: pathName,
        createdTime: new Date(),
        clusterCounter: clusterCounter
      }
    })
    return upsertPath
}

export async function readPaths(userId){
  const pathUser = await db.user.findUnique({
    where: {
      userId: userId
    },
    include: {
      traversalPaths: true,
    }
  })
  return pathUser
}

export async function readPath(pathId){
  const path = await db.traversalPath.findUnique({
    where: {
      pathId: pathId
    }
  })
  return path
}
