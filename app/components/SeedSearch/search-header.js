import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import { Form, useParams, Link } from "@remix-run/react"
import { useState, useEffect } from "react"

export function Header({ searchString }) {
  const params = useParams();

  const [search, setSearch] = useState("abstract poetry");

  useEffect(() => {
    searchString !== null && setSearch(searchString);
  }, [searchString])



  if (params.paperId) {



    return (
      <>
        <div className="header-wrapper" />
        <div className="header">
          <div className="search flex-space-between">
            <Form method="post" action="/search" className="search flex-row" style={{ cursor: "pointer", textDecoration: "none" }}>
              <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
                <input type="text" name="searchString" placeholder={search} />
              </div>

              <button type="submit" style={{ cursor: "pointer" }}>
                <img src={glass} alt="Glass Logo" />
              </button>

            </Form>
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
