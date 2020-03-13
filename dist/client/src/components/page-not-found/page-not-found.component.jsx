import React, { Component } from "react"
import { withAuth } from "@okta/okta-react"
import { Link } from "react-router-dom"

export default withAuth(
  class PageNotFound extends Component {
    logout = async () => this.props.auth.logout("/")
    render() {
      return (
        <div className="body-wrapper">
          <main className="container page-not-found-wrapper">
            <div className="row">
              <div className="col l6">
                <h1>Oops, something's gone wrong!</h1>
                <h5>Not to worry, why don't you try one of these helpful links:</h5>
                <div className="button-wrapper">
                  <Link to="/home" className="btn pink">
                    Home Page
                  </Link>
                  <Link to="/tracks" className="btn see-all-tracks-btn">
                    See all tracks
                  </Link>
                </div>
              </div>

              <div className="col l6">
                <img
                  className="responsive-img"
                  src="/images/page-not-found_optim.jpg"
                  alt="sad man for page not found"
                />
              </div>
            </div>
          </main>
        </div>
      )
    }
  }
)
