import React, { Component } from "react"
import { withAuth } from "@okta/okta-react"
import { Redirect } from "react-router-dom"
import { getTokenFromLocalStorage } from "../../helpers"
import "./account.styles.scss"
import AccountItem from "../account-item/account-item.component"
import M from "materialize-css"

export default withAuth(
  class Account extends Component {
    static defaultProps = {
      fileTooLargeMsg: "The file size is too large. Please upload a smaller file.",
      duplicateMemberNameMsg: "Sorry, this user name is not available."
    }
    state = {
      settingsFields: {
        email: "",
        genre1: "",
        fileName: "",
        genre2: "",
        genre3: "",
        instrument1: "",
        instrument2: "",
        instrument3: "",
        memberName: "",
        location: "",
        phone: "",
        socialMedia1: "",
        socialMedia2: "",
        socialMedia3: "",
        website: ""
      },
      btnIsDisabled: false,
      currUserID: "",
      currUserSettings: [],
      currentUserInput: "",
      displayErrMsg: false,
      displayFileTooLargeMsg: false,
      displayDuplicateMemberNameMsg: false,
      inputFieldisDisabled: false,
      isUploading: false,
      redirectToMembers: false,
      allMembers: []
    }

    authorization =
      "Bearer " + JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken

    logout = async () => this.props.auth.logout("/")

    getIdToken = () => {
      const tokenClaims = getTokenFromLocalStorage().idToken.claims
      this.setState({ currUserID: tokenClaims.sub })
    }

    handleChange = e => {
      this.setState({
        settingsFields: { ...this.state.settingsFields, [e.target.name]: e.target.value }
      })
    }

    handleSelect = e => {
      this.setState({
        settingsFields: { ...this.state.settingsFields, location: e.target.value }
      })
    }

    handleImageUpload = e => {
      if (e.target.files[0]) {
        e.target.files[0].size < 15000
          ? this.setState({
              btnIsDisabled: false,
              displayFileTooLargeMsg: false,
              settingsFields: { ...this.state.settingsFields, fileName: e.target.files[0] }
            })
          : this.setState({ displayFileTooLargeMsg: true, btnIsDisabled: true })
      } else {
        console.log("The file size is too large. Please upload a smaller file.")
      }
    }

    handleCloseErrMsg = () => {
      this.setState({ displayDuplicateMemberNameMsg: false, inputFieldisDisabled: false })
    }

    addMemberAccount(settingsFields) {
      const formData = new FormData()
      const settingsFieldsAndCurrUserID = { ...settingsFields, userID: this.state.currUserID }
      const { ...fields } = settingsFieldsAndCurrUserID
      for (let key in fields) {
        formData.append(key, fields[key])
      }
      fetch("/api/members", {
        method: "POST",
        headers: { authorization: this.authorization },
        body: formData
      }).then(data => {
        if (data.status === 403) {
          this.setState({ displayErrMsg: true, isUploading: false, redirectToMembers: false })
        }
      })
    }
    handleSubmit = async e => {
      e.preventDefault()
      const { ...settingsFields } = this.state.settingsFields
      const duplicateMemberName = this.state.allMembers.some(member => {
        return (
          member.memberName.toLowerCase().replace(/\s/g, "") ===
            settingsFields.memberName.toLowerCase().replace(/\s/g, "") &&
          member.userID !== this.state.currUserID
        )
      })
      if (duplicateMemberName) {
        this.setState({ displayDuplicateMemberNameMsg: true, inputFieldisDisabled: true })
      } else {
        try {
          await this.addMemberAccount(settingsFields)
          if (!this.state.displayErrMsg) {
            this.setState({ isUploading: true })
            setTimeout(() => this.setState({ redirectToMembers: true }), 2000)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    async componentDidMount() {
      M.AutoInit()

      try {
        const members = await fetch("/api/members", {
          method: "GET",
          headers: { "Content-Type": "application/json", authorization: this.authorization }
        })
        await this.getIdToken()
        const membersJSON = await members.json()
        this.setState({ allMembers: membersJSON.data })
        const currUserSettings = await membersJSON.data.find(
          member => member.userID === this.state.currUserID
        )
        const { ...fields } = await currUserSettings
        if (currUserSettings) {
          this.setState({ settingsFields: { ...fields } })
        }
      } catch (e) {
        this.setState({ redirect: true })
        console.log(e)
      }
    }

    render() {
      if (this.state.redirectToMembers) {
        return <Redirect to="/members" />
      }

      const {
        btnIsDisabled,
        inputFieldisDisabled,
        displayDuplicateMemberNameMsg,
        settingsFields,
        displayFileTooLargeMsg,
        currUserSettings,
        isUploading
      } = this.state

      return (
        <main className="container Settings">
          <div className="Settings-heading">
            <i className="material-icons medium Settings-gear-icon">settings</i>
            <h2 className="Settings-heading-text">Settings</h2>
          </div>

          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <div className="Settings-user-image">
              <p className="image-guide">
                <em>(Images should be: 50 x 50 pixels)</em>
              </p>
              {displayFileTooLargeMsg ? (
                <p className="Settings-image-upload-err-msg">{this.props.fileTooLargeMsg}</p>
              ) : (
                ""
              )}
              <label className="Settings-user-image-text" htmlFor="file-name">
                User Image
              </label>

              <div className="btn Settings-user-image-upload-btn">
                <input
                  type="file"
                  id="file-name"
                  name="fileName"
                  accept="image/*"
                  onChange={this.handleImageUpload}
                />
              </div>
            </div>
            {displayDuplicateMemberNameMsg && (
              <p
                className="Settings-duplicate-member-name-err-msg"
                onClick={this.handleCloseErrMsg}
              >
                <i className="material-icons prefix" style={{ border: "0px solid red" }}>
                  cancel
                </i>
                {this.props.duplicateMemberNameMsg}
              </p>
            )}

            <div className="Settings-fields">
              {currUserSettings ? (
                Object.entries(settingsFields).map(field => {
                  if (
                    field[0] !== "file" &&
                    field[0] !== "_id" &&
                    field[0] !== "__v" &&
                    field[0] !== "fileName" &&
                    field[0] !== "userID"
                  ) {
                    return (
                      <AccountItem
                        disabled={inputFieldisDisabled}
                        currUserSettingsFieldKey={field[0]}
                        currUserSettingsFieldValue={field[1]}
                        handleChange={this.handleChange}
                        handleSelect={this.handleSelect}
                        key={field[0]}
                      />
                    )
                  }
                })
              ) : (
                <h1>loading...</h1>
              )}
            </div>
            <div className="Settings-submit-btn">
              <button
                id="submit-btn"
                className="btn green waves-effect waves-light"
                type="submit"
                name="action"
                disabled={btnIsDisabled}
              >
                Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>

          {isUploading && (
            <div className="progress">
              <div className="indeterminate"></div>
            </div>
          )}
        </main>
      )
    }
  }
)
