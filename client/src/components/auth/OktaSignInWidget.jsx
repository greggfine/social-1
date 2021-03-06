import React, { Component } from "react"
import ReactDOM from "react-dom"
import OktaSignIn from "@okta/okta-signin-widget"
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css"
import "./OktaSignInWidget.styles.scss"

class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this)
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      authParams: {
        pkce: true
      },
      username: "guest@greggfinedev.com",
      i18n: {
        en: {
          "primaryauth.password.placeholder": `Password(for demo) : Visitor123`
        }
      }
    })
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError)
  }

  componentWillUnmount() {
    this.widget.remove()
  }

  render() {
    return (
      <div>
        <img
          src="images/audio-e-guitars-guitars-music-6966 copy.jpg"
          alt="musical instruments banner"
          className="responsive-img fcc-banner"
        />
      </div>
    )
  }
}

export default OktaSignInWidget
