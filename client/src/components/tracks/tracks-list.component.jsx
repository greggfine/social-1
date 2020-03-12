import React, { Component } from "react"
import { Link } from "react-router-dom"
import { withAuth } from "@okta/okta-react"
import { getTokenFromLocalStorage, formatDate } from "../../helpers"
import io from "socket.io-client"

import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./tracks-list.styles.scss"

import Comment from "../comment/comment.component"
import Audio from "../audio/audio.component"

let socket

export default withAuth(
  class Tracks extends Component {
    state = { tracks: [], currentUserId: "" }

    async componentDidMount() {
      M.AutoInit()
      socket = io("http://localhost:3001")
      //   socket = io("https://rocky-sea-24378.herokuapp.com/")
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
      await this.setState({
        currentUserId: getTokenFromLocalStorage().idToken.claims.sub
      })
      const sortedTracks = await this.sortTracks(tracksJSON.data)
      await this.setState({ tracks: sortedTracks })
    }

    logout = async () => this.props.auth.logout("/")

    sortTracks = tracksJSON => {
      const { currentUserId } = this.state
      const currentUserTrack = tracksJSON.find(track => track.userId === currentUserId)
      const otherUserTracks = tracksJSON.filter(track => track.userId !== currentUserId)
      return currentUserTrack ? [currentUserTrack, ...otherUserTracks] : [...otherUserTracks]
    }

    render() {
      const { tracks, currentUserId } = this.state
      const trackListItems = tracks.map((track, idx) => {
        let [dateFormat, timeFormat] = formatDate(track.createdAt)
        return (
          <li key={track._id} className="collection-item col s12 tracklist-item">
            {idx === 0 && track.userId === currentUserId && (
              <i className="material-icons grey-text text-lighten-5 light-green accent-4 tracklist-item-mood-icon">
                mood
              </i>
            )}
            <blockquote className="blockquote">{track.notes}</blockquote>
            <p className="tracklist-item-upload-date">
              <strong>Posted:</strong>
              <span>{` ${dateFormat},  ${timeFormat}`}</span>
            </p>
            <div className="tracklist-item-audio-and-links">
              <Audio track={track} />
              <div className="tracklist-item-links">
                {currentUserId === track.userId ? (
                  <Link to={`/tracks/${track._id}/edit`}>
                    <i className="material-icons grey-text text-darken-1">build</i>
                  </Link>
                ) : null}
                <Comment track={track} />
              </div>
            </div>
          </li>
        )
      })

      return (
        <div className="body-wrapper">
          <main className="container tracklist">
            <div className="page-heading container">
              <i className="material-icons large tracks-upload-icon">music_video</i>

              <h2 className="tracklist-heading-text">Tracks</h2>
            </div>
            <ul className="collection container">{trackListItems}</ul>
          </main>
          {/* <Footer /> */}
        </div>
      )
    }
  }
)
