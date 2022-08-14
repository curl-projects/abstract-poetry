export async function setItem(name, object){
  window.sessionStorage.setItem(name, JSON.stringify(object))
}

export async function getItem(name){
  return JSON.parse(window.sessionStorage.getItem(name))
}
