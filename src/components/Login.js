import React, { Component } from 'react';
import { CommonFunctions, GetFunction, postFunction } from './General/CommonFunctions';
import UserObject from '../Models-Object/UserObject';
import { connect } from 'react-redux'


export class Login extends Component {
    state =
        {
            userName: '',
            password: ''
        }



    onSubmit = (e) => {
        e.preventDefault();
        let user = postFunction('', { ...this.state })
        if (user && user[0]) {
            const userObj = new UserObject({ ...user[0] })
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
                    <a href="@">שכחת סיסמה?</a>
                </div>
            </form>
        )
    }
}

export const mapStateToProps = state => {
    return {
        user: state.user
    }
};
const mapDispatchToProps = dispatch => {
    return {
        setUser: (userObject) => dispatch({ type: 'SET_USER', userObj: userObject })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);

