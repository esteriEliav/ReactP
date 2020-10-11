import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export class Login extends Component {
  state =
    {
        userName:'',
        password: ''
    } 



    onSubmit = (e) => {
        e.preventDefault();
        if(fun())
            alert("ברוכים הבאים " + this.state.userName);
            //אפשרות גישה לאתר
        else
            alert("שם משתמש או סיסמה שגויים")
    }
 
    handleChange = input => e => {
        e.preventDefault();    
        this.setState({[input]: e.target.value });
    };

  render() {
    return (
        <form onSubmit= {this.onSubmit} className="login-form">
      
                <label className="login-item" htmlFor="user-name">שם משתמש</label>
                <input className="login-item input-field" type="text" name="user-name" value={this.state.userName} id="name" placeholder="שם משתמש" onChange={this.handleChange('userName')} />                  
                <label className="login-item" htmlFor="password">סיסמה </label> 
                <input className="login-item input-field" type="password" name="password" value={this.state.password} id="password" placeholder="סיסמה" onChange={this.handleChange('password')} />                            
                <div className="login-item">
                    <input className="login-button" type="submit" value="כניסה"/>
                </div>
                <div className="login-item">
                {/* הקישור יפנה לדף של שחזור סיסמה */}
               {/*<a href="@">שכחת סיסמה?</a>*/} 
               <Link to="/signup" ><a href="@">שכחת סיסמה?</a></Link>
                </div>
        </form>
    )
  }
}
//זו כביכול הפונקציה שתחזור מהשרת
function fun(params) {
    return true;
    //return false;
}


export default Login
        