import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import share from "../../../public/assets/share.svg";
import focus from "../../../public/assets/focus.svg";
// Stateless styled components to keep `$paperId.jsx` concise


export function Header() {
  return (
    <>
      <div className="header-wrapper" />
      <div className="header flex-space-between">
        <div className="search flex-row">
          <div className="search-input">
            <p className="search-prompt">Browse spaces of papers with</p>
            <input type="text" placeholder="abstract poetry" />
          </div>
          <img src={glass} alt="Glass Logo" />
        </div>
        <img src={account} alt="Account Login" />
      </div>
    </>
  )
}

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
        <div className = "abs-left toolbar panel-glass ">
          <img src = {share} alt ="Share or Export Reading List"/>
        </div>
    </div>
  )

}

export function Controls() {

  return (
    <>
      <div className="traversal-controls">
          <div className = "abs-right toolbar panel-glass flex-row" style = {{width: "100%", flexDirection: "row-reverse"}}>
            <img src = {focus} alt ="Focus on a specific paper"/>
          </div>
          <div className="join"/>
      </div>
    </>
  )

}