import { useEffect, useState } from "react"


export function PaperAbstract(props){

  const [abstract, setAbstract] = useState('')

  useEffect(() => {
    const keywords  = ["Introduction", "Methods", "Background", "Results", "Discussion", "Conclusion", "Recommendations"];
    var rawAbstract = props.abstract;

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      const regexp = new RegExp(keyword, "i");

      rawAbstract = rawAbstract.replace(regexp, '<span class="keyword">' + keyword + '</span>');
    }

    setAbstract("<p>" + rawAbstract + "<h1> {'\u00A0'} </h1>" + "</p>")
  }, [props.abstract])


  return(
    <div className="abstract" dangerouslySetInnerHTML={{__html: abstract}}/>
  )
}
