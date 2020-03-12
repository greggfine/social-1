import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { withAuth } from "@okta/okta-react"
import io from "socket.io-client"

import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./edit.styles.scss"

import Footer from "../footer/footer.component"
import NotesField from "../notes-field/notes-field.component"
import SubmitBtn from "../submit-btn/submit-btn.component"

let socket

export default withAuth(
  class Edit extends Component {
    state = {
      currentTrack: "",
      editedNotes: "",
      currentTrackID: null,
      redirectToTracks: false,
      notes: ""
    }
    async componentDidMount() {
      M.AutoInit()
      socket = io("http://localhost:3001")
      //   socket = io("https://rocky-sea-24378.herokuapp.com/")
      const { id } = this.props.match.params
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
      const currentTrack = await tracksJSON.data.find(track => track._id === this.getTrackID())
      this.setState({
        currentTrack,
        currentTrackID: id,
        notes: currentTrack.notes
      })
    }
    getTrackID = () => {
      const pathname = this.props.location.pathname
      return pathname.slice(8, pathname.lastIndexOf("/"))
    }

    handleDelete = async () => {
      this.setState({ redirectToTracks: true }, () => {
        socket.emit("updateTrackCount")
      })
      await fetch(
        `/api/tracks/${this.state.currentTrackID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
          },
          body: JSON.stringify({ fileName: this.state.currentTrack.fileName })
        },
        () => {
          socket.emit("updateTrackCount")
        }
      )
    }
    handleNotesChange = e => {
      this.setState({ notes: e.target.value })
    }
    handleSubmit = async notes => {
      if (notes.length > 0) {
        await fetch(`/api/tracks/${this.state.currentTrackID}/edit`, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "application/json",
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
          }),
          body: JSON.stringify({ notes })
        })
        this.setState({ redirectToTracks: true })
      }
    }
    logout = async () => this.props.auth.logout("/")

    render() {
      const { notes } = this.state
      if (this.state.redirectToTracks === true) {
        return <Redirect to="/tracks" />
      }
      return (
        <div className="body-wrapper edit-delete container">
          <main className="container">
            <div className="edit-track-notes">
              <NotesField notes={notes} handleNotesChange={this.handleNotesChange} />
              <div className="edit-submit-btn-wrapper">
                <SubmitBtn handleSubmit={() => this.handleSubmit(notes)} />
              </div>
            </div>
            <div className="edit-btns-wrapper delete-track-wrapper">
              <h4 className="edit-list-heading">Delete your track and associated comments</h4>
              <i>
                <a
                  className="material-icons red-text text-darken-1 modal-trigger delete-track-icon"
                  href="#modal1"
                >
                  delete
                </a>
                <div id="modal1" className="modal" dismissible="true">
                  <div className="modal-content delete-modal">
                    <h4>Delete</h4>
                    <hr />
                    <p className="delete-track-message">
                      Are you sure you want to <span>delete this track?</span>
                    </p>
                    <hr />
                  </div>
                  <div className="modal-footer escape-or-delete-wrapper">
                    <span className="escape-message">(Press ESC to cancel)</span>
                    <i
                      href="#!"
                      className="modal-close waves-effect waves-green btn-flat"
                      onClick={this.handleDelete}
                    >
                      <button className="btn btn-small red">Delete</button>
                    </i>
                  </div>
                </div>
              </i>
            </div>
          </main>
          {/* <Footer /> */}
        </div>
      )
    }
  }
)
