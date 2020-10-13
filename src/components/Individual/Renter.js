
import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import RenterObject from '../../Models-Object/RenterObject'

// public int UserID { get; set; }
// public string Name { get; set; }
// public string SMS { get; set; }
// public string Email { get; set; }
// public string Phone { get; set; }
// public int RoleID { get; set; }
// public string UserName { get; set; }
// public string Password { get; set; }


export class Renter extends Component {
    state = {

        name: 'שוכרים',
        fieldsArray: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' },
        { field: 'LastName', name: 'שם משפחה', type: 'text' }, { field: 'SMS', name: 'SMS', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }, , { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g }
            , { field: 'UserName', name: 'שם משתמש', type: 'text' }, { field: 'Password', name: 'סיסמא', type: 'text' }, , { field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }],
        ObjectsArray: /*rentersList */[{ OwnerID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
        { OwnerID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
        { OwnerID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }],

        fieldsToSearch: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' }, { field: 'LastName', name: 'שם משפחה', type: 'text' },
        { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel' }]
    }

    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.SMS === '' && object.Email === '') {
            generalEror = 'SMS חובה להכניס אימייל או '
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }

    submit = (type, object) => {
        let path = 'Renter/' + type
        path += type !== 'Search' ? 'Renter' : ''
        if (type === 'Add' || type === 'Update') {
            let newObj = RenterObject()
            if (type === 'Add')
                newObj.UserID = 1
            else
                newObj.UserID = object.UserID
            if (object.FirstName !== '')
                newObj.FirstName = object.FirstName
            if (object.LastName !== '')
                newObj.LastName = object.LastName
            if (object.SMS !== '')
                newObj.SMS = object.SMS
            if (object.Email !== '')
                newObj.Email = object.Email
            if (object.Phone !== '')
                newObj.Phone = object.Phone
            if (object.UserName !== '')
                newObj.UserName = object.UserName
            if (object.Password !== '')
                newObj.Password = object.Password
            if (object.add)
                newObj.document = object.add
            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.UserID)
            object = id
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/Renter', path)
    }

    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, submit: this.submit, type: 'Add', name: 'הוספת שוכר',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: [], setForForm: this.setForForm,
                validate: this.validate
            }}>הוספת שוכר </Link>
            ],
            ButtonsForTable: [],
        }
    }
    setForForm = () => []
    set = object => {
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: postFunction('Renter/getPropertiesbyRenterID', object.OwnerID),
            type: 'table'
        }}>
            דירות ששוכר</Link>]
        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow,
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
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
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

export default Renter;
export const rentersList = [];//GetFunction('Renter/GetAllRenters');