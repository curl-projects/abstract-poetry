export function Header() {
  return (
    <>
      <div className="header-wrapper"/>
      <div className="header">
        <div className="search-input">
          <p className="small">Browse spaces of papers with</p>
          <input type="text" placeholder="abstract poetry"/>
        </div>
      </div>
    </>

  )
}

export function Background() {
  return (
    <>
      <div className="background">
        <div className="background-img"/>
      </div>
      <div className="background-panel-left"/>
      <div className="background-panel-right"/>
    </>
  )
}

