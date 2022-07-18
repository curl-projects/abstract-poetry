import focus from "../../../public/assets/focus.svg";

export function Background() {
  const backgroundImg = {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 1,
  }

  return (
    <>
      <div className="background">
        <div className='background-img' />
      </div>
      <div className="background-panel-left" />
      <div className="background-panel-right" />
    </>
  )
}


export function Controls() {

  return (
    <>
      <div className="traversal-controls" style={{pointerEvents: 'none'}}>
          <div className = "abs-right toolbar panel-glass flex-row" style = {{pointerEvents: 'auto', width: "100%", flexDirection: "row-reverse"}}>
            <img src = {focus} alt ="Focus on a specific paper"/>
          </div>
          <div className="join"/>
      </div>
    </>
  )
}
