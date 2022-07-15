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

export async function clusterDOIs(doi){
  let data = {
    "doiList": [doi]
  }
  let url = "https://abstract-poetry-microservice.azurewebsites.net/api/ClusterEmbeddings?code=p41wjN5G4JXgPyMc0R5EvwSLWBE7h8iEQkwxMeP7Jbs8AzFuAIZSmw=="
  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  })

  return res.json()
}
