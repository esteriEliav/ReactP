
import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";

// public int UserID { get; set; }
// public string Name { get; set; }
// public string SMS { get; set; }
// public string Email { get; set; }
// public string Phone { get; set; }
// public int RoleID { get; set; }
// public string UserName { get; set; }
// public string Password { get; set; }


export class Renter extends Component {
    submit = (type, object) => {
        let x = false;
        if (type === 'Add')
            x = this.addObject(object)
        else if (type === 'Update')
            x = this.updateObject(object)
        else
            x = this.Search(object)
        if (x)
            return <Redirect to='/PropertyOwner' />
        return null;
    }
    Search = (object) => {
        Axios.post('PropertyOwner/Search', { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        Axios.post('PropertyOwner/UpdatePropertyOwner', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הדירה נשמרה בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        object.UserID = 1;
        Axios.post('PropertyOwner/AddPropertyOwner', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('הדירה עודכנה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = (object) => {
        window.confirm("האוביקט ימחק מיד");
    }
    state = {

        name: 'שוכרים',
        fieldsArray: /*Axios.get('Renter/GetAllRenters') */[{ field: 'UserID', name: 'קוד שוכר', type: 'text' }, { field: 'FirstName', name: 'שם פרטי', type: 'text' },
        { field: 'LastName', name: 'שם משפחה', type: 'text' }, { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' },
        { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'UserName', name: 'שם משתמש', type: 'text' }, { field: 'Password', name: 'סיסמא', type: 'text' }],
        ObjectsArray: [{ OwnerID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
        { OwnerID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
        { OwnerID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }],

    }


    validate = () => {

    }
    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, erors: [], submit: this.submit, type: 'Add', name: 'הוספת שוכר',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: []
            }}> </Link>
            ],
            ButtonsForTable: [],
        }
    }
    set = (object) => {
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: Axios.post('Renter/getPropertiesbyRenterID', object.OwnerID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                .then(res => res.data),
            type: 'table'
        }}>
            דירות ששוכר</Link>]
        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details location={{
                object: this.props.object,
                fieldsArray: this.state.fieldsArray,
                LinksPerObject: some.LinksPerObject,
                LinksForEveryRow: some.LinksForEveryRow,
                ButtonsForEveryRow: some.ButtonsForEveryRow,
                fieldsToAdd: some.fieldsToAdd
            }}
            />

        }
        else
            return <Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set} delObject={this.deleteObject}
                validate={this.validate} erors={this.state.erors} submit={this.submit}
                fieldsToSearch={this.state.fieldsToSearch} />

    }
    render() {
        return (

            <div>
                {this.rend()}
            </div>

        )
    }
}

export default Renter
export const RenterList = []//Axios.get('Renter/getAllRenters').then(res => res.data)