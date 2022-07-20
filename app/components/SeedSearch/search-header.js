import glass from "../../../public/assets/glass.svg";
import account from "../../../public/assets/account.svg";
import { Form, useParams, Link } from "@remix-run/react"

export function Header() {
  const params = useParams();
  if (params.paperId) {
    return (
      <>
        <div className="header-wrapper" />
        <div className="header flex-space-between">
          <Link to={'/search'} className="search flex-row" style={{ cursor: "pointer", textDecoration: "none" }}>
            <div className="search-input">
              <p className="search-prompt">Browse spaces of papers</p>
              <div className="flex-row" style={{ display: "inline-flex" }} >
                <input type="text" name="searchString" placeholder="abstract poetry " />
                <button type="submit" style={{ cursor: "pointer" }}>
                  <img src={glass} alt="Glass Logo" />
                </button>
              </div>
            </div>
          </Link>
          <img src={account} alt="Account Login" />
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="header-wrapper" />
        <div className="header flex-space-between">
          <Form method="post" className="search flex-row">
            <div className="search-input">
              <p className="search-prompt">Browse spaces of papers</p>
              <div className="flex-row-space-between" style={{ display: "inline-flex", width: "100%" }} >
                <input type="text" name="searchString" placeholder="abstract poetry " />
                <button type="submit" style={{ cursor: "pointer" }}>
                  <img src={glass} alt="Glass Logo" />
                </button>
              </div>
            </div>
          </Form>
          { false? <img src={account} alt="Account Login" /> : null }
        </div>
      </>
    )
  }
}
