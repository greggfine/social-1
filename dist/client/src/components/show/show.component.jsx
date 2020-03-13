import React, { Component } from "react"
import { withAuth } from "@okta/okta-react"
import { Redirect } from "react-router-dom"
import Footer from "../footer/footer.component"
import io from "socket.io-client"
import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./show.styles.scss"
import { getTokenFromLocalStorage } from "../../helpers"
import CommentListItems from "../comment-list-items/comment-list-items.component"
import CommentField from "../comment-field/comment-field.component"
let socket

export default withAuth(
  class Show extends Component {
    state = {
      tracks: [],
      currentComment: "",
      comments: [],
      currentUserID: "",
      editedCommentInput: "",
      textAreaVisible: false,
      textAreaVisibleCommentID: "",
      redirect: false,
      displayDeletedMssg: false
    }
    logout = async () => this.props.auth.logout("/")
    getIdToken = () => {
      const tokenClaims = getTokenFromLocalStorage().idToken.claims
      this.setState({
        currentUserID: tokenClaims.sub
      })
    }
    getTrackID = () => {
      const pathname = this.props.location.pathname
      return pathname.slice(pathname.lastIndexOf("/") + 1)
    }
    getTracks = async () => {
      try {
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
        const commentsForCurrentTrack = await tracksJSON.data.find(
          track => track.userId === this.getTrackID()
        )
        return [tracksJSON.data, commentsForCurrentTrack.comments]
      } catch (e) {
        this.setState({ redirect: true })
        console.log(e)
      }
    }
    async componentDidMount() {
      M.AutoInit()
      socket = io("http://localhost:3001")
      //   socket = io("https://rocky-sea-24378.herokuapp.com/")
      socket.on("trackDeletedRedirect", () => {
        this.setState({
          displayDeletedMssg: true
        })
        window.setTimeout(() => {
          this.setState({
            redirect: true
          })
        }, 3000)
      })
      try {
        socket.on("updateDOM", async () => {
          const [tracksJSON, commentsForCurrentTrack] = await this.getTracks()
          await this.setState(() => ({
            tracks: tracksJSON,
            comments: commentsForCurrentTrack.reverse()
          }))
        })
      } catch (e) {
        this.setState({ redirect: true })
        console.log(e)
      }

      try {
        const [tracksJSON, commentsForCurrentTrack] = await this.getTracks()

        this.getIdToken()
        await this.setState(prevState => ({
          tracks: tracksJSON,
          comments: [...prevState.comments, ...commentsForCurrentTrack.reverse()]
        }))
      } catch (e) {
        this.setState({ redirect: true })
        console.log(e)
      }
    }

    handleDeleteComment = (currentTrack, commentId) => {
      socket.emit("deleteComment", currentTrack, commentId)
    }
    handleDisplayTextArea = (commentID, comment) => {
      this.setState({
        textAreaVisible: !this.state.textAreaVisible,
        textAreaVisibleCommentID: commentID,
        editedCommentInput: comment
      })
    }
    handleCommentInput = e => {
      this.setState({ currentComment: e.target.value })
    }
    handleSubmitComment = currentTrack => {
      const { currentComment, currentUserID } = this.state
      if (currentComment.length > 0) {
        socket.emit("postComment", currentComment, currentTrack, currentUserID)
        this.setState({ currentComment: "" })
      } else {
        this.setState({ redirect: true })
      }
    }
    handleSubmitEditedComment = (commentID, currentTrack) => {
      const { editedCommentInput, textAreaVisible } = this.state
      if (editedCommentInput.length >= 1) {
        socket.emit("editComment", commentID, editedCommentInput, currentTrack)
      }
      this.setState({
        editedCommentInput: "",
        textAreaVisible: !textAreaVisible
      })
    }
    handleEditedCommentInput = e => {
      this.setState({ editedCommentInput: e.target.value })
    }
    render() {
      const {
        tracks,
        currentComment,
        comments,
        editedCommentInput,
        textAreaVisible,
        textAreaVisibleCommentID,
        currentUserID,
        redirect,
        displayDeletedMssg
      } = this.state
      if (redirect) {
        return <Redirect to="/tracks" />
      }
      if (displayDeletedMssg) {
        return (
          <h2 className="container track-deleted-mssg">
            Sorry, that track was deleted by its creator. :-(
          </h2>
        )
      }
      const currentTrack = tracks.find(track => track.userId === this.getTrackID())
      if (currentTrack) {
        return (
          <div className="body-wrapper show-wrapper">
            <main className="container">
              <div className="page-heading">
                <i className="material-icons large comment-icon">comment</i>
                <h2 className="comment-list-heading">Comments</h2>
              </div>

              <div className="row  show-list-wrapper">
                <div className="container">
                  <div className="audio-blockquote-wrapper">
                    <audio
                      className="audio-player"
                      src={`/audio/${currentTrack.fileName}`}
                      controls
                      controlsList="nodownload"
                    ></audio>
                    <blockquote>"{currentTrack.notes}"</blockquote>
                  </div>
                  <CommentField
                    currentComment={currentComment}
                    handleCommentInput={this.handleCommentInput}
                  />
                  <div className="show-btns-wrapper">
                    <button
                      className="btn green waves-effect waves-light comment-submit-btn"
                      type="submit"
                      name="action"
                      onClick={currTrack => this.handleSubmitComment(currentTrack)}
                    >
                      Submit
                      <i className="material-icons right">send</i>
                    </button>
                  </div>
                  <ul id="comment-list" className="comment-list">
                    <CommentListItems
                      comments={comments}
                      currentUserID={currentUserID}
                      currentTrack={currentTrack}
                      textAreaVisible={textAreaVisible}
                      textAreaVisibleCommentID={textAreaVisibleCommentID}
                      editedCommentInput={editedCommentInput}
                      handleDeleteComment={this.handleDeleteComment}
                      handleEditedCommentInput={this.handleEditedCommentInput}
                      handleSubmitEditedComment={this.handleSubmitEditedComment}
                      handleDisplayTextArea={this.handleDisplayTextArea}
                    />
                  </ul>
                </div>
              </div>
            </main>
            {/* <Footer /> */}
          </div>
        )
      } else {
        return <div></div>
      }
    }
  }
)
