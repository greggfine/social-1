import React, { Component } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { SecureRoute, ImplicitCallback, withAuth } from "@okta/okta-react"
import Home from "./components/home/home.component"
import Tracks from "./components/tracks/tracks-list.component"
import Account from "./components/account/account.component"
import TrackUpload from "./components/track-upload/track-upload.component"
import Edit from "./components/edit/edit.component"
import Show from "./components/show/show.component"
import Login from "./components/auth/Login"
import Nav from "./components/nav/nav.component"
import Members from "./components/members/members.component"
import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./App.styles.scss"

export default withAuth(
  class App extends Component {
    componentDidMount() {
      M.AutoInit()
    }
    logout = async () => this.props.auth.logout("/")

    render() {
      return (
        <Route
          render={({ location }) => (
            <div>
              <Switch location={location}>
                <Route
                  path="/"
                  exact
                  render={() => <Login baseUrl="https://dev-885516!.okta.com" />}
                />
                <Route exact path="/implicit/callback" component={ImplicitCallback} />
              </Switch>
              {location.pathname !== "/" && <Nav logout={this.logout} />}
              <Switch>
                <SecureRoute path="/account" exact component={Account} />
                <SecureRoute path="/home" exact component={Home} />
                <SecureRoute path="/members" exact component={Members} />
                <SecureRoute path="/tracks" exact component={Tracks} />
                <SecureRoute path="/tracks/new" exact component={TrackUpload} />
                <SecureRoute path="/tracks/:id/edit" exact component={Edit} />
                <SecureRoute path="/track/:id" exact component={Show} />
              </Switch>
            </div>
          )}
        />
      )
    }
  }
)
