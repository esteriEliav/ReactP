import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";

export class Main extends Component {

    submit = (name, object) => {
        if (name === 'הוסף')
            this.addObject(object)
        else
            this.updateObject(object)
    }
    updateObject = (object) => {
        Axios.post('Property/UpdateSubProperty', object).then(x => { alert("הדירה נשמרה בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
    }
    addObject = (object) => {
        object.PropertyID = 1;
        Axios.post('Property/AddSubProperty', object).then(x => { alert('הדירה עודכנה בהצלחה') });
    }
    deleteObject = (object) => {
        window.confirm("האוביקט ימחק מיד");
    }
    state = {

        name: 'משכירים',
        fieldsOwnersArray: [{ field: 'OwnerID', name: 'קוד משכיר', type: 'text' }, { field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
        OwnersArray: [{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
        { OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
        { OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }],
        LinksForEveryRow: [{ name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ name: 'הוספת משכיר', link: '/Form' }],
        ButtonsForEveryRow: [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }],
        ButtonsForTable: [],
        fieldsToAdd: [],
        erors: []

    }


    validate = (OwnerFirstName, OwnerLastName, Phone, Email) => {
        let erors = []
        if (Email.indexOf('@') === -1)
            erors.push({ name: 'אימייל לא חוקי', index: 4 })
        if (erors.length > 0) {
            this.setState({ erors: erors })
            return true
        }
        return false
    }

    set = (object) => {
        let LinksPerObject = [<Link to='/Properties'>דירות</Link>]//שולח  רשימת דירות שמתקבלים מהפונקציה
        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: this.state.LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    render() {
        return (

            <div>

                <h1>{this.props.id}</h1>
                <Table name={this.state.name} fieldsArray={this.state.fieldsOwnersArray} objectsArray={this.state.OwnersArray}
                    LinksForTable={this.state.LinksForTable} ButtonsForTable={this.state.ButtonsForTable}
                    erors={this.state.erors} submit={this.submit}
                    delObject={this.deleteObject} set={this.set} validate={this.validate}
                    fieldsToSearch={this.state.fieldsOwnersArray.filter((field, index) => index !== 0)}
                />


            </div>

        )
    }
}

export default Main
