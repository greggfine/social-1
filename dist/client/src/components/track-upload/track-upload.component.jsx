import React, { Component } from "react"
import { withAuth } from "@okta/okta-react"
import { Redirect } from "react-router-dom"
import { getTokenFromLocalStorage } from "../../helpers"
import io from "socket.io-client"

import M from "materialize-css"
import "./track-upload.styles.scss"

import Footer from "../footer/footer.component"

let socket

export default withAuth(
  class TrackUpload extends Component {
    static defaultProps = {
      errMsg: "Sorry, you can only post one track per 24 hours.",
      fileTooLargeMsg: "The file size is too large. Please upload a smaller file."
    }
    state = {
      file: [],
      notes: "",
      currentUserId: "",
      redirectToTracks: false,
      isUploading: false,
      displayErrMsg: false,
      displayFileTooLargeMsg: false,
      btnIsDisabled: false
    }
    addTrack(file, notes) {
      const formData = new FormData()
      formData.append("userId", this.state.currentUserId)
      formData.append("notes", notes)
      formData.append("fileName", file)
      fetch("/api/tracks", {
        method: "POST",
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
        },
        body: formData
      }).then(data => {
        if (data.status === 403) {
          this.setState({ displayErrMsg: true, isUploading: false, redirectToTracks: false })
        }
      })
    }
    async componentDidMount() {
      M.AutoInit()
      socket = io("http://localhost:3001")
      //   socket = io("https://rocky-sea-24378.herokuapp.com/")
      this.getIdToken()
    }
    getIdToken = () => {
      this.setState({
        currentUserId: getTokenFromLocalStorage().idToken.claims.sub
      })
    }
    handleFileChange = e => {
      if (e.target.files[0]) {
        if (e.target.files[0].size < 8000000) {
          this.setState({
            btnIsDisabled: false,
            displayFileTooLargeMsg: false,
            file: e.target.files[0]
          })
        } else {
          this.setState({ displayFileTooLargeMsg: true, btnIsDisabled: true })
        }
      } else {
        console.log("The file size is too large. Please upload a smaller file.")
      }
    }
    handleNotesChange = e => {
      this.setState({ notes: e.target.value })
    }

    handleSubmit = async e => {
      e.preventDefault()
      const { file, notes, displayErrMsg } = this.state
      try {
        await this.addTrack(file, notes)
        if (!displayErrMsg) {
          this.setState({ isUploading: true })
          setTimeout(
            () =>
              this.setState({ redirectToTracks: true }, () => {
                socket.emit("updateTrackCount")
              }),
            2000
          )
        }
      } catch (e) {
        console.error(e)
      }
    }
    logout = async () => this.props.auth.logout("/")

    render() {
      const redirectToTracks = this.state.redirectToTracks
      if (redirectToTracks === true) {
        return <Redirect to="/tracks" />
      }
      const {
        notes,
        isUploading,
        displayErrMsg,
        btnIsDisabled,
        displayFileTooLargeMsg
      } = this.state
      const { errMsg, fileTooLargeMsg } = this.props
      return (
        <div className="body-wrapper">
          <main className="container track-upload">
            <div className="page-heading container">
              <i className="material-icons large cloud-upload-icon">cloud_upload</i>
              <h2 className="track-upload-heading-text">Post a track</h2>
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="container post-track-form"
              encType="multipart/form-data"
            >
              <p className="image-guide">
                <em>(Files should be: mp3/max-size: 8MB)</em>
              </p>
              <div className="file-field-wrapper">
                <div className="file-field input-field">
                  <div className="btn file-btn">
                    <span className="file-span">File</span>

                    <input
                      type="file"
                      id="file-name"
                      name="fileName"
                      accept=".mp3"
                      required
                      onChange={this.handleFileChange}
                    />
                  </div>

                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                  </div>
                  <p id="file-too-large-message"></p>
                </div>
              </div>

              <div className="input-field col s12 track-notes">
                <textarea
                  name="notes"
                  id="notes"
                  className="materialize-textarea track-upload-notes-area"
                  required
                  autoFocus
                  maxLength="500"
                  data-length="120"
                  value={notes}
                  spellCheck="false"
                  onChange={this.handleNotesChange}
                ></textarea>
                <label htmlFor="notes">
                  <i className="material-icons track-notes-pencil-icon">create</i>
                  <span className="add-notes-text"> Add Your Notes...</span>
                </label>
              </div>

              <div className="track-upload-submit-btn-wrapper">
                <div className="input-field">
                  <button
                    id="submit-btn"
                    className="btn green waves-effect waves-light comment-submit-btn"
                    type="submit"
                    name="action"
                    disabled={btnIsDisabled}
                  >
                    Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </div>
            </form>

            {displayErrMsg ? <p className="track-upload-err-msg">{errMsg}</p> : ""}
            {displayFileTooLargeMsg ? (
              <p className="track-upload-err-msg">{fileTooLargeMsg}</p>
            ) : (
              ""
            )}

            {isUploading && (
              <div className="progress">
                <div className="indeterminate "></div>
              </div>
            )}
          </main>
          {/* <Footer /> */}
        </div>
      )
    }
  }
)
