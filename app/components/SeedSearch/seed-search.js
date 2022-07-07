import { Form, useSubmit } from "@remix-run/react"

export function SeedSearch(props){
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

      <Form method="post">
        <input
          name="doi"
          type="text"
          placeholder={"Start search with paper DOI!"}
          style={{
            height: "30px",
            width: "300px"
          }}
          />
        <button type="submit">Search!</button>
      </Form>
      {props.errorCode === 404 && <p>Paper not found in database</p> }
    </div>
  )
}
