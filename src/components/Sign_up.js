import React, { Component, PureComponent } from 'react';
import Axios from "./Axios";
import { CommonFunctions, GetFunction, postFunction } from './General/CommonAxiosFunctions';
import Popup from 'reactjs-popup';

export class Sign_up extends PureComponent {
    state =
        {
            username: '',
            passemail: '',
            open: true
        }


    closeModal = () => {
        this.setState({ open: false })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        //פונקצייה שבודקת האם יש  שם ומייל או ,SMS ושולחת לשם
        let user = await postFunction('User/forgotpassword', { username: this.state.username, passemail: this.state.passemail })
        if (user) {
            alert(this.state.username + " סיסמא נשלחה אליך !!!!!!!!!!");
            this.closeModal()
        } //באם אין פון או מייל זה 
        else
            alert(this.state.username + " לא קיימים נתונים אלו במערכת, אנא נסה שוב ")

    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value });
    };

    render() {
        return (
            <Popup open={this.state.open} closeOnDocumentClick={false} modal>
                <a className="close close-login" onClick={this.closeModal}>
                    &times;</a>


                <form onSubmit={this.onSubmit} className="login-form">

                    <label className="login-item" htmlFor="user-name">שם משתמש</label>
                    <input className="login-item input-field" type="text" name="username" value={this.state.username} id="username" placeholder="שם משתמש" onChange={this.handleChange('username')} />
                    <label className="login-item" htmlFor="email">אימות אימייל</label>
                    <input className="login-item input-field" type="email" name="passemail" value={this.state.passemail} id="passemail" placeholder="מייל" onChange={this.handleChange('passemail')} />
                    <div className="login-item btn-enter">
                        <input className="login-button" type="submit" value="שליחה" />
                    </div>
                    <div className="login-item">
                        {/* הקישור יפנה לדף של שחזור סיסמה */}
                        {/*<a href="@">לקבלת  ?</a>*/}
                    </div>
                </form>
            </Popup>
        )
    }
}
export default Sign_up

