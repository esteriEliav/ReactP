import React, { Component } from 'react';
import { CommonFunctions, GetFunction, postFunction } from './General/CommonFunctions';
import UserDTO from '../Models-Object/UserObject';
import { connect } from 'react-redux'
import { Link, Redirect, Router } from 'react-router-dom';
import Axios from "./Axios"
//import user from '../Models-Object/UserObject';
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
            returnred:false
        }


    onSubmit = (e) => {
        e.preventDefault();
        let user = postFunction('User/Ifhaveuse', { ...this.state })
        if (user && user[0]) {
            const userObj = new UserDTO({ ...user[0] })
            alert(" ברוכים הבאים" + userObj.FirstName + ' ' + userObj.LastName);
            this.props.setUser(userObj);
this.setState({returnred:true})
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
            <div><form onSubmit={this.onSubmit} className="login-form">

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
                    
                    </div></form>  <Link to="/Home" onClick={() => { this.props.setUser(this.use1);this.setState({returnred:true});debugger;
 }}>set user-renter</Link>
        <Link to="/Home" onClick={() => { this.props.setUser(this.use2);this.setState({returnred:true});debugger;
 }}>set user-manager</Link>
 {/* {this.state.returnred?<Redirect to="/Home"></Redirect>:null} */}
<button onClick ={() => {debugger; Axios.post("https://localhost:44368/api/user/adduser",(this.use1)).then(x=>{console.log("yestt");})}}>tttttttt</button>
<button onClick ={() => { Axios.post("https://localhost:44368/api/task/gettypename",1).then(x=>{console.log("yes11");})}}>1111111</button>
<button onClick ={() => {debugger; Axios.get("https://localhost:44368/api/Rental/GetAllRentals").then(x=>{console.log(x.data);})}}>uuuu</button>

        </div>
            

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
        setUser: (userObject) => dispatch({ type:'SET_USER', userObj: userObject })
    }
}

//זו כביכול הפונקציה שתחזור מהשרת
// function fun(params) {
//     return true;
//     //return false;
// }


export default connect(mapStateToProps, mapDispatchToProps)(Login);

