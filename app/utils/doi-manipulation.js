export function slugifyDoi(doi){
  return doi.replace('/', '$')
}

export function deslugifyDoi(doiSlug){
  return doiSlug.replace('$', "/")
}

export function doiToJournal(doiSlug){
  if(typeof doiSlug !== "string"){
    throw "DOI slug must be a stringß"
  }

  else if(doiSlug.includes('pone')){
    return "PLoS ONE"
  }
  else if(doiSlug.includes('pgph')){
    return "PLoS Global Public Health"
  }
  else if(doiSlug.includes('pgen')){
    return "PLoS Genetics"
  }
  else if(doiSlug.includes('pcbi')){
    return "PLoS Computational Biology"
  }
  else if(doiSlug.includes('ppat')){
    return "PLoS Pathogens"
  }
  else if(doiSlug.includes('pbio')){
    return "PLoS Biology"
  }
  else if(doiSlug.includes('pntd')){
    return "PLoS Neglected Tropical Diseases"
  }
  else if(doiSlug.includes('pmed')){
    return "PLoS Medicine"
  }
  else {
    return "Unknown Journal"
  }
}
