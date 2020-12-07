import React from 'react'
import { withRouter } from "react-router";
import axios from 'axios';

class EventDetails extends React.Component {

  state = {
    ev: {

    }
  }

  componentDidMount() {
    const events = this.props.tasksList;

    axios.get(events + this.props.match.params.id)
      .then(response => {
        this.setState({ ev: response.data });
      });

  }



  render() {
    return (
      <React.Fragment>
        <h1> {this.state.ev.name} Details </h1>
        <p> {this.state.ev.EventDetails} navuuuuu</p>

        <a href={this.state.ev.link}></a>
      </React.Fragment>
    )
  }
}
export default withRouter(EventDetails);



