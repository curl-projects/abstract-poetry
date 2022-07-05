export function slugifyDoi(doi){
  return doi.replace('/', '$')
}

export function deslugifyDoi(doiSlug){
  return doiSlug.replace('$', "/")
}
