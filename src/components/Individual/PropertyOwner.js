import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";

export class PropertyOwner extends Component {

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
        Axios.post('PropertyOwner/AddPropertyOwner', { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        Axios.post('PropertyOwner/UpdatePropertyOwner', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הדירה נשמרה בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        object.PropertyID = 1;
        Axios.post('PropertyOwner/AddPropertyOwner', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('הדירה עודכנה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = (object) => {
        window.confirm("האוביקט ימחק מיד");
    }
    state = {

        name: 'משכירים',
        fieldsOwnersArray: /*Axios.get('PropertyOwner/getAllOwners') */[{ field: 'OwnerID', name: 'קוד משכיר', type: 'text' }, { field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
        OwnersArray: [{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
        { OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
        { OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }],
        LinksForEveryRow: [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ type: 'Add', name: 'הוספת משכיר', link: '/Form' }],
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
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: Axios.post('PropertyOwner/GetPropertiesbyOwnerID', object.OwnerID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                .then(res => res.data),
            type: 'table'
        }}>
            דירות</Link>]
        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: this.state.LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details location={{
                object: this.props.object,
                fieldsArray: this.state.fieldsOwnersArray,
                LinksPerObject: some.LinksPerObject,
                LinksForEveryRow: some.LinksForEveryRow,
                ButtonsForEveryRow: some.ButtonsForEveryRow,
                fieldsToAdd: some.fieldsToAdd
            }}
            />

        }
        else
            return <Table name={this.state.name} fieldsArray={this.state.fieldsOwnersArray} objectsArray={this.state.OwnersArray}
                LinksForTable={this.state.LinksForTable} ButtonsForTable={this.state.ButtonsForTable}
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

export default PropertyOwner
