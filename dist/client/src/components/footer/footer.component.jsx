import React from "react"
import "./footer.styles.scss"

const currentYear = new Date().getFullYear()

const Footer = () => (
  <footer className="page-footer indigo darken-1 footer-wrapper">
    <div className="container fcc-logo-social-icons-wrapper">
      <div className="row">
        <div className="col l6 s12">
          <img
            className="nav-brand-logo fcc-footer-logo"
            src="/images/fcc_logo.jpg"
            alt="freelance composers banner"
          />
        </div>
        <div className="col l4 offset-l2 s12">
          <ul>
            <li>
              <a
                className="grey-text text-lighten-3"
                href="https://www.facebook.com/groups/fccfypm/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="facebook-icon"
                  src="/images/fb-icon.jpg"
                  alt="freelance commercial composers facebook page link"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      <div className="container copyright-text">
        <sup>&copy;</sup> {currentYear}, <span>GreggFineDev. All rights reserved.</span>
      </div>
    </div>
  </footer>
)

export default Footer
