import React from "react"
import "./audio.styles.scss"

const Audio = ({ track }) => (
  <audio
    src={`/audio/${track.fileName}`}
    controls
    controlsList="nodownload"
    className="track-list-audio-player"
  ></audio>
)

export default Audio
