import React, { Component } from 'react';

export class Sign_up extends Component {
  state =
    {
        userName:'',
        password: ''
    } 


//
    onSubmit = (e) => {
        e.preventDefault();
        if(fun())
            alert(" סיסמא נשלחה אליך" + this.state.userName);
            //באם אין פון או מייל זה 
        else
            alert("לא קיימים נתונים אלו במערכת, אנא נסה שוב")
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
                <a href="@">לקבלת  ?</a>
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


export default Sign_up
        