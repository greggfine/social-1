import React from "react"
import "./footer.styles.scss"

const currentYear = new Date().getFullYear()

const Footer = () => (
  <footer className="page-footer indigo darken-1 footer-wrapper">
    <div className="container ">
      <div className="row fcc-logo-social-icons-wrapper">
        <img
          className=" footer-logo"
          src="/images/fcc_logo.jpg"
          src="/images/music-notes_logo.png"
          alt="freelance composers banner"
        />
        <ul>
          <li>
            <a
              className="grey-text text-lighten-3"
              href="https://www.youtube.com/channel/UCmOpHGj4JRWCdXhllVTZCVw?view_as=subscriber"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="social-icon"
                src="/images/youtube-icon.jpg"
                alt="code creative youtube channel"
              />
            </a>
          </li>
        </ul>
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
