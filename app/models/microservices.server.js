export async function warmupMicroservice(){
    let data = {
      "command": "warmup"
    }
    let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddings?code=p41wjN5G4JXgPyMc0R5EvwSLWBE7h8iEQkwxMeP7Jbs8AzFuAIZSmw=="
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    })
    return res.json()
}

export async function clusterDOIs(doi, referencesList){
  let data = {
    "doiList": [doi],
    "references": referencesList
  }
  let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddings?code=p41wjN5G4JXgPyMc0R5EvwSLWBE7h8iEQkwxMeP7Jbs8AzFuAIZSmw=="
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function clusterDOIsv2(doi, referencesList){
  let data = {
    "doiList": [doi],
    "references": referencesList
  }
  let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddingsV2?code=ODR_3JP6aQenrJBRMhwVkvxPLrwTUCp4QTIEIEI8a_hsAzFu_M7POg=="
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  })

  return res.json()
}
