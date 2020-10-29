import React from 'react'
import { withRouter } from "react-router";
import axios from 'axios';

class EventDetails extends React.Component {

  state = {
    ev:{

    } 
  }

  componentDidMount(){
    axios.get('https://jsonplaceholder.typicode.com/users/'+ this.props.match.params.id)
    .then( response => {
      this.setState({ev: response.data});
    });

}



  render() {
    return (
      <React.Fragment>
      <h1> {this.state.ev.name} Details </h1>
      <p> {this.state.ev.email}</p>
      <p> {this.state.ev.date}</p>
      
      <a href={this.state.ev.link}></a>
      </React.Fragment>
    )
  }
}
export default withRouter(EventDetails);



