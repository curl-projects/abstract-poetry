import account from "../../../public/assets/account.svg";
import logout from "../../../public/assets/logout.svg";
import { SocialsProvider } from "remix-auth-socials";
import { useState, useEffect } from 'react';
import { Form } from "@remix-run/react";
import { Tooltip } from "@mui/material";

export function BibliographyHeader(props){

  return(
    <>
      <div className="header-wrapper">
        <div className="user-control-wrapper">
          {props?.user &&
            <>
                <div style={{display: "flex", alignItems: "center"}}>
                  <Form action="/logout" method="post">
                    <input type='hidden' name="url" value={props.url}/>
                    <Tooltip title="Logout">
                      <button type="submit" className="save-button" style={{width: "100%", height: "100%"}}>
                        <img src={logout} alt="Logout"/>
                      </button>
                    </Tooltip>
                  </Form>
                </div>
            </>
          }
          {!props?.user &&
            <>
            <div className="user-text-wrapper">
                <div>
                    <input type='hidden' name="url" value={props.url}/>
                    <button type="submit">
                      <p className="logout-text"></p>
                    </button>
                </div>
            </div>
              <Form
                method="post"
                action={`/auth/${SocialsProvider.GOOGLE}?returnTo=${props.url}`}
                >
                <input type='hidden' name="url" value={props.url}/>
                <Tooltip title="Login">
                  <button type='submit'>
                      <img src={account} className="account-button" fill='666666' alt="Account Button" />
                  </button>
                </Tooltip>
              </Form>
            </>
          }
      </div>
    </div>
    </>
    )
  }
