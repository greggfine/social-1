import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Divider from "@material-ui/core/Divider"
import LanguageIcon from "@material-ui/icons/Language"
import ShareIcon from "@material-ui/icons/Share"
import Album from "@material-ui/icons/Album"
import PhoneIphoneOutlinedIcon from "@material-ui/icons/PhoneIphoneOutlined"
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined"
import LocationCityOutlinedIcon from "@material-ui/icons/LocationCityOutlined"
import MusicNoteOutlinedIcon from "@material-ui/icons/MusicNoteOutlined"

import "./modal.styles.scss"

const blueText = "#3949AB"

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: "7px",
    outline: "none",
    padding: "10px"
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

export default function SimpleModal({ open, setOpen, handleClose, currMember }) {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <List style={modalStyle} className={`${classes.paper} modal-card`}>
          <ListItem id="simple-modal-title">
            <h2>{currMember.memberName}</h2>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <LocationCityOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.location}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            {" "}
            <PhoneIphoneOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.phone}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <EmailOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.email}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <MusicNoteOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.instrument1}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <MusicNoteOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.instrument2}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <MusicNoteOutlinedIcon style={{ color: blueText }} />
            <span>{currMember.instrument3}</span>
          </ListItem>
          <Divider />

          <ListItem id="simple-modal-description">
            <Album style={{ color: blueText }} />
            <span>{currMember.genre1}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <Album style={{ color: blueText }} />
            <span>{currMember.genre2}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <Album style={{ color: blueText }} />
            <span>{currMember.genre3}</span>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <ShareIcon style={{ color: blueText }} />
            <a href={currMember.socialMedia1} target="_blank">
              <span>{currMember.socialMedia1}</span>
            </a>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <ShareIcon style={{ color: blueText }} />
            <a href={currMember.socialMedia2} target="_blank">
              <span>{currMember.socialMedia2}</span>
            </a>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <ShareIcon style={{ color: blueText }} />
            <a href={currMember.socialMedia3} target="_blank">
              <span>{currMember.socialMedia3}</span>
            </a>
          </ListItem>
          <Divider />
          <ListItem id="simple-modal-description">
            <LanguageIcon color="action" style={{ color: blueText }} />
            <a href={currMember.website} target="_blank">
              <span>{currMember.website}</span>
            </a>
          </ListItem>
          <Divider />
        </List>
      </Modal>
    </div>
  )
}
