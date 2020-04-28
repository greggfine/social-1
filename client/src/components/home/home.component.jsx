import React, { Component } from "react"
import { Link } from "react-router-dom"
import { withAuth } from "@okta/okta-react"
import io from "socket.io-client"

import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./home.styles.scss"

import Footer from "../footer/footer.component"

let socket

export default withAuth(
  class Home extends Component {
    state = {
      authenticated: null,
      currentUserName: "",
      currentUserID: "",
      tracks: []
    }

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated()
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated })
      }
    }

    getIdToken = () => {
      const idToken = JSON.parse(localStorage.getItem("okta-token-storage"))
      this.setState({
        currentUserName: idToken.idToken.claims.name,
        currentUserID: idToken.idToken.claims.sub
      })
    }

    async componentDidMount() {
      M.AutoInit()
      //   socket = io("http://localhost:3001")
      socket = io("https://salty-bayou-12671.herokuapp.com/")
      const fetchTracks = async () => {
        const tracks = await fetch("/api/tracks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
          }
        })
        const tracksJSON = await tracks.json()
        await this.setState({ tracks: tracksJSON.data })
      }
      fetchTracks()
      this.checkAuthentication()
      this.getIdToken()
      socket.on("updateCurrNumTracks", () => {
        const fetchTracks = async () => {
          const tracks = await fetch("/api/tracks", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
            }
          })
          const tracksJSON = await tracks.json()
          await this.setState({ tracks: tracksJSON.data })
        }
        fetchTracks()
      })
    }

    async componentDidUpdate() {
      this.checkAuthentication()
    }

    login = async () => this.props.auth.login("/")
    logout = async () => this.props.auth.logout("/")

    render() {
      const { currentUserName, currentUserID, tracks } = this.state
      const getCurrentUserTrackCount = arr =>
        arr.filter(track => track.userId === currentUserID).length
      const main = (
        <main className="container Home">
          <h3 className="Home-heading">
            Welcome <span className="Home-heading-username">{currentUserName}</span>
          </h3>
          <div className="column Home-cards ">
            <div className="col s12 l6  Home-post-card musician-directory-card">
              <div className="card z-depth-2  ">
                <div className="card-content ">
                  <div className="Home-post-card-heading musician-directory-heading">
                    <i className="material-icons">account_circle</i>
                    <span className="card-title">Musician Directory</span>
                  </div>
                  <div className="card-action">
                    <Link to="/members" className="btn-small green">
                      SEE ALL MEMBERS
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className=" Home-post-card mix-feedback-card-wrapper">
              <div className="card z-depth-2 mix-feedback-card">
                <div className="card-content">
                  <div className="card-left row">
                    <div className="Home-post-card-heading">
                      <i className="material-icons">library_music</i>
                      <span className="card-title">Post Track</span>
                    </div>
                    <p className="Home-post-card-content">
                      You have
                      <span className="badge white-text pink Home-post-card-badge">
                        {getCurrentUserTrackCount(tracks)}
                      </span>
                      track/s posted
                    </p>
                    <div className="card-action">
                      <Link to="/tracks/new" className="btn-small green">
                        Post a track
                      </Link>
                    </div>
                  </div>

                  <div className="card-right">
                    <div className="Home-post-card-heading">
                      <i className="material-icons">comment</i>
                      <span className="card-title">Comment</span>
                    </div>
                    <p className="Home-post-card-content Home-post-card-content-right">
                      There are
                      <span
                        className="badge white-text pink Home-post-card-badge"
                        id="current-num-of-tracks"
                      >
                        {tracks.length}
                      </span>
                      tracks to comment on
                    </p>
                    <div className="card-action">
                      <Link
                        to="/tracks"
                        className="btn-small green see-all-tracks-btn see-all-tracks-btn-Home"
                      >
                        See all tracks
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            src="images/audio-e-guitars-guitars-music-6966.jpg"
            alt="musical instruments"
            className="responsive-img container Home-banner"
          />
        </main>
      )

      return (
        <div className="body-wrapper">
          {main}
          <Footer />
        </div>
      )
    }
  }
)
