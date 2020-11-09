
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
export class RedirectTo extends Component {
    render() {
        return (
           <Redirect to={this.props.location.redirect}/>
        )
    }
}

export default RedirectTo