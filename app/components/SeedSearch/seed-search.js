import { Link } from "@remix-run/react"

export function SeedSearch(){
  return(
    <div style={{border: '2px dashed red',
                 height: "50%",
                 width: "60%",
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center"
               }}>
      <Link to="/exampleId"><h1>Start Searching!</h1></Link>
    </div>
  )
}
