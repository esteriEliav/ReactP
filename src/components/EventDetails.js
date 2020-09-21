import React from 'react'
import { withRouter } from "react-router";

class EventDetails extends React.Component {

  render() {
    return (
    <h1>{this.props.match.params.id} Details </h1>
    )
  }
}
export default withRouter(EventDetails);