export function Counter(array) {
  var count = {};
  array.forEach(val => count[val] = (count[val] || 0) + 1);
  return count;
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export function getClusterPapers(clusters, clusterId){
  let doiList = []
  for(let [key, value] of Object.entries(clusters)){
    if(value.toString() === clusterId.toString()){
      doiList.push(key)
    }
  }
  return doiList
}
