import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Security } from "@okta/okta-react"
import config from "./app.config"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router } from "react-router-dom"

function onAuthRequired({ history }) {
  history.push("/")
}

ReactDOM.render(
  <Router>
    <Security
      //   issuer={config.issuer}
      //   issuer="https://dev-885516.okta.com/oauth2/default"
      issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
      clientId={config.client_id}
      redirectUri={config.redirect_uri}
      onAuthRequired={onAuthRequired}
      pkce={true}
    >
      <App />
    </Security>
  </Router>,
  document.getElementById("root")
)
serviceWorker.unregister()
