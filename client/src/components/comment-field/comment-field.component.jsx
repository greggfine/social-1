import React from "react"
import "./comment-field.styles.scss"

const CommentField = ({ currentComment, handleCommentInput }) => (
  <div className="input-field col s12 comment-field">
    <textarea
      name="comment"
      cols="200"
      rows="5"
      id="textarea1"
      className="materialize-textarea"
      required
      autoFocus
      minLength="1"
      maxLength="500"
      value={currentComment}
      onChange={handleCommentInput}
    ></textarea>
    <label htmlFor="textarea1" className="comment-field-text">
      <i className="material-icons pencil-icon">create</i>
      Write a comment...
    </label>
  </div>
)

export default CommentField
