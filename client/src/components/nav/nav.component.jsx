import React from "react"
import { NavLink, withRouter } from "react-router-dom"
import "./nav.styles.scss"

const Nav = ({ logout }) => (
  <div className="nav-wrapper">
    <nav>
      <div className="nav-wrapper indigo darken-1 z-depth-2">
        <div className="container">
          <NavLink to="/" className="brand-logo">
            <img className="nav-brand-logo" src="/images/music-notes_logo.png" alt="logo" />
          </NavLink>
          <NavLink to="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </NavLink>
          <ul className="right hide-on-med-and-down">
            <li>
              <NavLink to="/home" exact activeClassName="active-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/members" exact activeClassName="active-link">
                Members
              </NavLink>
            </li>
            <li>
              <NavLink to="/tracks" exact activeClassName="active-link">
                Tracks
              </NavLink>
            </li>
            <li>
              <NavLink to="/tracks/new" exact activeClassName="active-link">
                Post
              </NavLink>
            </li>
            <li>
              <NavLink to="/account" exact activeClassName="active-link">
                Settings
              </NavLink>
            </li>
            <li className="logout-link">
              <NavLink to="/logout" exact activeClassName="active-link" onClick={logout}>
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <ul className="sidenav" id="mobile-demo">
      <li>
        <NavLink to="/home">Home</NavLink>
      </li>
      <li>
        <NavLink to="/members">Members</NavLink>
      </li>
      <li>
        <NavLink to="/tracks">Tracks</NavLink>
      </li>
      <li>
        <NavLink to="/tracks/new">Post</NavLink>
      </li>
      <li>
        <NavLink to="/account">Settings</NavLink>
      </li>
      <li>
        <NavLink to="/logout" onClick={logout}>
          Logout
        </NavLink>
      </li>
    </ul>
  </div>
)

export default withRouter(Nav)
