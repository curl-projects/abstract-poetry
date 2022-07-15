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

export function Share() {

  return (
    <div className="traversal-share">
        <div className = ""/>
    </div>
  )

}

export function Controls() {

  return (
    <div className="traversal-controls">
        <div className = ""/>
    </div>
  )

}
