import { Form } from "@remix-run/react";

export function ControlPanel(){
  return(
    <div className="ControlPanel" style={{
        border: '2px solid yellow',
        flex: 0.5,
        margin: "20px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>Control Panel</h1>
        <div className="ButtonWrapper" style={{
          display: 'flex',
        }}>
        <Form method="post">
          <button
            name="impression"
            type="submit"
            value="false"
            style={{
              margin: "10px",
              height: "40px"
            }}>Less Like This</button>
          <button
            name="impression"
            type="submit"
            value="true"
            style={{
              margin: "10px",
              height: "40px"
            }}>More Like This</button>
        </Form>
        </div>

    </div>
  )
}
