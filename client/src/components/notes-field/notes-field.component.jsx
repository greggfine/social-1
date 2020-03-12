import React from "react"
import "./notes-field.styles.scss"

const NotesField = ({ notes, handleNotesChange }) => (
  <div className="input-field col s12 track-notes">
    <textarea
      name="notes"
      id="notes"
      className="materialize-textarea edit-notes-area"
      required
      autoFocus
      maxLength="500"
      value={notes}
      spellCheck="false"
      onChange={handleNotesChange}
    ></textarea>
    <label htmlFor="notes">
      <i className="material-icons pencil-icon">create</i>
      <span className="add-notes-text"> Edit your track's notes...</span>
    </label>
  </div>
)

export default NotesField
