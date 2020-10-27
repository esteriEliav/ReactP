import React, { Component } from 'react';
import { CommonFunctions, GetFunction, postFunction } from './General/CommonFunctions';
import UserDTO from '../Models-Object/UserObject';
import { connect } from 'react-redux'
import { Link, Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';
import Axios from "./Axios"
//import Router from './Router';
import userDTO from '../Models-Object/UserObject';
//const use1 = new userDto(1, 'aa', 'bb', null, null, null, 3);
//const use2 = new userDto(1, 'aa', 'bb', null, null, null, 1);

export class Login extends Component {
    use1 = new UserDTO(1, 'aa', 'bb', null, null, null, 3);
    use2 = new UserDTO(1, 'aa', 'bb', null, null, null, 1);
    state =
        {
            userName: '',
            password: '',

        }


    onSubmit = (e) => {
        e.preventDefault();
        let user = postFunction('User/Ifhaveuse', this.state)
        if (user && user != null) {
            const userObj = new UserDTO({ ...user })
            alert(" ברוכים הבאים" + userObj.FirstName + ' ' + userObj.LastName);
            this.props.setUser(userObj);
        }
        else
            alert("שם משתמש או סיסמה שגויים")
    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit} className="login-form">

                <label className="login-item" htmlFor="user-name">שם משתמש</label>
                <input className="login-item input-field" type="text" name="user-name" value={this.state.userName} id="name" placeholder="שם משתמש" onChange={this.handleChange('userName')} />
                <label className="login-item" htmlFor="password">סיסמה </label>
                <input className="login-item input-field" type="password" name="password" value={this.state.password} id="password" placeholder="סיסמה" onChange={this.handleChange('password')} />
                <div className="login-item">
                    <input className="login-button" type="submit" value="כניסה" />
                </div>
                <div className="login-item">
                    {/* הקישור יפנה לדף של שחזור סיסמה */}
                    {/* <a href="@">שכחת סיסמה?</a> */}
                    {/*<a href="@">שכחת סיסמה?</a>*/}
                    <Link to="/signup" >שכחת סיסמה?</Link>

                </div></form>




        )
    }
}



export const mapStateToProps = state => {
    return {
        user: state.user
    }
};
export const mapDispatchToProps = dispatch => {
    return {
        setUser: (userObject) => dispatch({ type: 'SET_USER', userObj: userObject })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

