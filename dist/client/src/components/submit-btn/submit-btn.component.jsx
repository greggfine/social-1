import React from "react"
import "./submit-btn.styles.scss"

const SubmitBtn = ({ handleSubmit }) => (
  <div className="input-field">
    <button
      id="submit-btn"
      className="btn green waves-effect waves-light comment-submit-btn"
      type="submit"
      name="action"
      onClick={handleSubmit}
    >
      Submit
      <i className="material-icons right">send</i>
    </button>
  </div>
)

export default SubmitBtn
