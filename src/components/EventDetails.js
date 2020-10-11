import React from 'react'
import { withRouter } from "react-router";

class EventDetails extends React.Component {

  render() {
    return (
    <h1>{this.props.match.params.id} משימה </h1>
    // לשרת ומציגה את פרטי האובייקט.....
    
    )
  }
}
export default withRouter(EventDetails);