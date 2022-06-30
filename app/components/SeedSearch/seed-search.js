import { Form } from "@remix-run/react"

export function SeedSearch(){
    return(
    <div style={{border: '2px dashed red',
                 height: "50%",
                 width: "60%",
                 display: "flex",
                 flexDirection: 'column',
                 justifyContent: "center",
                 alignItems: "center"
               }}>
      <h1>Start Searching!</h1>

      <Form method='post'>
        <input
          name="corpusId"
          type="text"
          placeholder={"Start search with corpusId!"}
          style={{
            height: "30px",
            width: "300px"
          }}
          />
        <button type="submit">Search!</button>
      </Form>
    </div>
  )
}
