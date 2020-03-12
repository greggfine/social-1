import React from "react"
import Avatar from "@material-ui/core/Avatar"
import "./avatar.styles.scss"

export default function ImageAvatars({ fileName }) {
  return (
    <td>
      <Avatar alt="Gregg Fine" src={`/imgs/${fileName}`} className="avatar" />
    </td>
  )
}
