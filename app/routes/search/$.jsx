import { useActionData, useParams } from "@remix-run/react"


export default function PaperId(){
  const params = useParams();
  const actionData = useActionData();

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
      <div className="ComponentWrapper" style={{border: '2px dashed black',
                   height: "90%",
                   width: "80%",
                   display: "flex",
                   flexDirection: "column",
                   justifyContent: "center",
                   alignItems: "center"
                 }}>
        <div className="PaperViewer"style={{
            flex: 1.5,
            width: "90%",
            border: '2px dashed purple',
            display: "flex",
          }}>
          <ControlPanel />
          <Outlet />
        </div>
        <TraversalViewer params={params}/>
      </div>
    </div>
  )
}
