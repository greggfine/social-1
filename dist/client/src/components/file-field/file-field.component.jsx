import React from "react"
import "./file-field.styles.scss"

const FileField = ({ handleFileChange }) => (
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
          onChange={handleFileChange}
        />
      </div>

      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
      <p id="file-too-large-message"></p>
    </div>
  </div>
)

export default FileField
