export function Header() {
  return (

    <div className="header flex-row">
      <div className="search-input">
        <p><small>Browse spaces of papers with</small></p>
        <input type="text" placeholder="abstract poetry"/>
      </div>
      <div className="search button"/>
    </div>

  )
}

export function Background() {
  return (
    <div className="background" />
  )
}