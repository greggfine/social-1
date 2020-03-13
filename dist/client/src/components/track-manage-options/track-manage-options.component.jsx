import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css"
import "./track-manage-options.styles.scss"
import io from "socket.io-client"
let socket

const TrackManageOptions = ({ track }) => {
  useEffect(() => {
    M.AutoInit()
    socket = io("http://localhost:3001")
    // socket = io("https://rocky-sea-24378.herokuapp.com/")
  }, [])

  return (
    <div>
      <ul id="dropdown1" className="dropdown-content edit-delete-wrapper">
        <li>
          <Link to={`/tracks/${track._id}/edit`} className="edit-btn">
            <i className="material-icons">create</i>
            edit
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default TrackManageOptions
