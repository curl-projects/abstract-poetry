import React from 'react';
import { Form } from "@remix-run/react"
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export function SeedSearch(props) {
  return (
    <div style={{
      border: '2px dashed red',
      height: "50%",
      width: "60%",
      display: "flex",
      flexDirection: 'column',
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1>Start Searching!</h1>
      <Form method="post">
        <input
          name="searchString"
          type="text"
          placeholder={"Start search with DOI or Search Term!"}
          style={{
            height: "30px",
            width: "300px"
          }}
        />
        <button type="submit">Search!</button>
      </Form>
      <Snackbar
        open={props.errorExists}
        autoHideDuration={4000}
        message={props.errorData ? props.errorData.message : ""}
        onClose={()=>props.setErrorExists(false)}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              sx={{ p: 0.5 }}
              color="inherit"
              onClick={() => props.setErrorExists(false)}
              >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}
