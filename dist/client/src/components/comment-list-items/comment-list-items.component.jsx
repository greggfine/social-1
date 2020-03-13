import React, { useEffect } from "react"

import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./comment-list-items.styles.scss"

const CommentListItems = ({
  comments,
  currentUserID,
  currentTrack,
  textAreaVisible,
  textAreaVisibleCommentID,
  editedCommentInput,
  handleDeleteComment,
  handleEditedCommentInput,
  handleSubmitEditedComment,
  handleDisplayTextArea
}) => {
  useEffect(() => {
    M.AutoInit()
  })
  return comments.map(comment => (
    <i className="comment-list-items " key={comment.id}>
      {comment.commentCreatorID === currentUserID ? (
        <i className="edit-delete-icons">
          <i
            className="material-icons grey-text text-darken-1"
            onClick={() => handleDisplayTextArea(comment.id, comment.comment)}
          >
            create
          </i>

          <i>
            <a className="material-icons grey-text text-darken-1 modal-trigger" href="#modal1">
              delete
            </a>
            <div id="modal1" className="modal" dismissible="true">
              <div className="modal-content delete-modal">
                <h4>Delete</h4>
                <hr />
                <p className="modal-delete-message">
                  Are you sure you want to <span>delete this comment?</span>
                </p>
                <hr />
              </div>
              <div className="modal-footer modal-content">
                <span className="modal-escape-message">(Press ESC to cancel)</span>
                <i
                  href="#!"
                  className="modal-close waves-effect waves-green btn-flat"
                  onClick={() => handleDeleteComment(currentTrack, comment.id)}
                >
                  <button className="btn btn-small red">Delete</button>
                </i>
              </div>
            </div>
          </i>
        </i>
      ) : null}

      <li className="collection-item comment-list-item grey lighten-3" key={comment.id}>
        {textAreaVisible && comment.id === textAreaVisibleCommentID ? (
          <div className="input-field col s12">
            <textarea
              name="editComment"
              id="edit-comment"
              cols="30"
              rows="10"
              value={editedCommentInput}
              onChange={handleEditedCommentInput}
              className="materialize-textarea text-area-visible"
              maxLength="500"
              spellCheck="false"
            ></textarea>
            <div className="cancel-submit-btns">
              <button
                className="btn-small cancel-comment-btn grey-text text-darken-4"
                onClick={() => handleDisplayTextArea()}
              >
                Cancel
              </button>
              <button
                className="btn-small green waves-effect waves-light"
                onClick={() => handleSubmitEditedComment(comment.id, currentTrack)}
              >
                Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-list-item-comment">{comment.comment}</p>
        )}
      </li>
    </i>
  ))
}

export default CommentListItems
