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
          <button style={{
              margin: "10px",
              height: "40px"
            }}>Less Like This</button>
          <button style={{
              margin: "10px",
              height: "40px"
            }}>More Like This</button>
        </div>

    </div>
  )
}
