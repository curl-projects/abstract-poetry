import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import home from "../../../public/assets/home.svg";
import { Form, useParams, Link } from "@remix-run/react";
import { useState, useEffect } from "react";

export function Header(props) {
  const params = useParams();

  if (params.paperId) {
    return (
      <>
        <div className="header-wrapper" />
        <div className="header">
          <div className="search flex-space-between">
            <div className="search-input" style={{ display: "inline-flex", width: "100%" }} >
              <label className="search-input-label">Searching semantic regions associated with</label>
              <input type="text" disabled="disabled" name="searchString" placeholder={props.searchString ? props.searchString : "abstract poetry"} />
            </div>
            <Link to="/search">
              <button type="submit" style={{ cursor: "pointer", paddingTop: '10px' }}>
                <img src={home} alt="Home Logo" />
              </button>
            </Link>
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
              <input type="text" name="searchString" placeholder="Explore all of PLOS with keywords or DOIs" autoFocus />
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

// <Link to={'/search'} className="search flex-row" style={{cursor: "pointer", textDecoration: "none"}}>
