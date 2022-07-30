import glass from "../../../public/assets/Glass.svg";
import account from "../../../public/assets/account.svg";
import home from "../../../public/assets/home.svg";
import { Form, useParams, Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { SocialsProvider } from "remix-auth-socials";
import Modal from '@mui/material/Modal';

export function Header(props) {
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false)

  if (params.paperId) {
    return (
      <>
        <div className="header-wrapper">
          <div className="user-control-wrapper">
            {props.user && <p className="small">Hey {props.user.name?.givenName}!</p>}
            <Form
              method="post"
              action={`/auth/${SocialsProvider.GOOGLE}`}
              >
              <button className="account-button">
                  <img className="account-button" fill='black' src={account} alt="Account Button" />
              </button>
            </Form>
          </div>
        </div>
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
        <div className="header-wrapper">
          <div className="user-control-wrapper">
            {props.user &&
              <>
              <div className="user-text-wrapper">
                  <div>
                    <Form action="/logout" method="post">
                      <button type="submit">
                        <p className="logout-text">Logout</p>
                      </button>
                    </Form>
                  </div>
              </div>
              <button onClick={()=>setModalOpen(true)}>
                  <img src={account} className="account-button" fill='666666' alt="Account Button" />
              </button>
              </>
            }
            {!props.user &&
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}`}
                >
                <button>
                    <img src={account} className="account-button" fill='666666' alt="Account Button" />
                </button>
              </Form>
            }
          </div>
        </div>
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
        <Modal
          open={modalOpen}
          onClose={()=>setModalOpen(false)}
          >
          <div className="modal-box">
            <h2>Hello</h2>
          </div>
        </Modal>
      </>
    )
  }
}

// // <Link to={'/search'} className="search flex-row" style={{cursor: "pointer", textDecoration: "none"}}>
// <div>
//   {props.user && <p className="small">Hey {props.user.name?.givenName}!</p>}
// </div>
