import React, { Component } from "react"
import { withAuth } from "@okta/okta-react"
import Paper from "@material-ui/core/Paper"
import EnhancedTable from "./enhanced-table.component"
import M from "materialize-css"
import "./members.styles.scss"

export default withAuth(
  class Members extends Component {
    state = {
      members: []
    }

    async componentDidMount() {
      M.AutoInit()
      const members = await fetch("/api/members", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
        }
      })
      const membersJSON = await members.json()

      await this.setState({ members: membersJSON.data })
    }

    render() {
      return (
        <div className="Members container">
          <Paper>
            <EnhancedTable members={this.state.members} />
          </Paper>
        </div>
      )
    }
  }
)
