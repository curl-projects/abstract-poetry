import glass from "../../../public/assets/glass.svg";
import account from "../../../public/assets/account.svg";
import { Form, useParams, Link } from "@remix-run/react"

export function Header() {
  const params = useParams();
  if (params.paperId) {
    return (
      <>
        <div className="header-wrapper" />
        <div className="header">
          <div className="search flex-space-between">
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <input type="text" name="searchString" placeholder="abstract poetry " />
            </div>
            <button type="submit" style={{ cursor: "pointer" }}>
              <img src={glass} alt="Glass Logo" />
            </button>
          </div>
          {false ? <img src={account} alt="Account Login" /> : null}
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="header-wrapper" />
        <div className="header">
          <Form method="post" className="search flex-space-between">
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <input type="text" name="searchString" placeholder="abstract poetry" />
            </div>
            <button type="submit" style={{ cursor: "pointer" }}>
              <img src={glass} alt="Glass Logo" />
            </button>
          </Form>
          {false ? <img src={account} alt="Account Login" /> : null}
        </div>
      </>
    )
  }
}
