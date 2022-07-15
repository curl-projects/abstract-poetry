import glass from "../../../public/assets/glass.svg";
import account from "../../../public/assets/account.svg";
import { Form, useParams, Link } from "@remix-run/react"
// Stateless styled components to keep `$paperId.jsx` concise

export function Header() {
  const params = useParams();
  if(params.paperId){
    return (
      <>
        <div className="header-wrapper" />
        <div className="header flex-space-between">
            <Link to={'/search'} className="search flex-row" style={{cursor: "pointer"}}>
              <div className="search-input">
                <p className="search-prompt">Browse spaces of papers with</p>
                <input type="text" name="searchString" placeholder="abstract poetry" />
              </div>
              <button type="submit" style={{cursor: "pointer"}}>
                <img src={glass} alt="Glass Logo" />
              </button>
            </Link>
          <img src={account} alt="Account Login" />
        </div>
      </>
    )
  }
  else{
    return (
      <>
        <div className="header-wrapper" />
        <div className="header flex-space-between">
            <Form method="post" className="search flex-row">
              <div className="search-input">
                <p className="search-prompt">Browse spaces of papers with</p>
                <input type="text" autoFocus name="searchString" placeholder="abstract poetry" />
              </div>
              <button type="submit" style={{cursor: "pointer"}}>
                <img src={glass} alt="Glass Logo" />
              </button>
            </Form>
          <img src={account} alt="Account Login" />
        </div>
      </>
    )
  }
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
