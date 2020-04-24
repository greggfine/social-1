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
      issuer={config.issuer}
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
