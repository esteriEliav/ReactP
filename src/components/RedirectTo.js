
import React, { Component, PureComponent } from 'react'
import { Redirect } from 'react-router-dom';
export class RedirectTo extends PureComponent {
    render() {
        return (
            <Redirect to={{ pathname: this.props.location.redirect, type: this.props.location.type, code: this.props.location.code }} />
        )
    }
}

export default RedirectTo