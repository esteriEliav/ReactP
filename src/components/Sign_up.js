import React, { Component } from 'react';

export class Sign_up extends Component {
  state =
    {
        userName:'',
        password: '',
        phone:''
    } 


//
    onSubmit = (e) => {
        e.preventDefault();
        if(fun())
            alert(this.state.userName+" סיסמא נשלחה אליך !!!!!!!!!!");
            //באם אין פון או מייל זה 
        else
            alert(this.state.userName+" לא קיימים נתונים אלו במערכת, אנא נסה שוב ")
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
                <label className="login-item" htmlFor="password">אימות לאימיל </label> 
                <input className="login-item input-field" type="password" name="password" value={this.state.password} id="password" placeholder="מייל" onChange={this.handleChange('password')} /> 
                <label className="login-item" htmlFor="phone">אימות לנייד </label> 
                <input className="login-item input-field" type="phone" name="phone" value={this.state.phone} id="phone" placeholder="פון" onChange={this.handleChange('phone')} />                           
                <div className="login-item">
                    <input className="login-button" type="submit" value="שליחה"/>
                </div>
                <div className="login-item">
                {/* הקישור יפנה לדף של שחזור סיסמה */}
                {/*<a href="@">לקבלת  ?</a>*/}
                </div>
        </form>
    )
  }
}
//זו כביכול הפונקציה שתחזור מהשרת
function fun(params) {
  return true;
    //  return false;
}


export default Sign_up
 
