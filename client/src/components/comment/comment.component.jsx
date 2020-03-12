import React from "react"
import { Link } from "react-router-dom"
import "./comment.styles.scss"

const Comment = ({ track }) => (
  <div className="section ">
    <Link
      to={`/track/${track.userId}`}
      className="grey-text text-darken-1 tooltipped"
      data-position="top"
      data-tooltip="Comment"
    >
      <i className="material-icons grey-text text-darken-1">comment</i>
      ...
    </Link>
  </div>
)

export default Comment
