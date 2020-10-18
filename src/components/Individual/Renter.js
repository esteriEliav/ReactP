
import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import Form from '../General/Form'

import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import RenterObject from '../../Models-Object/UserObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'

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
        { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel' }],
        isAutho: true,//false
        showForm: this.props.location.type == 'form' ? true : false,
        showDetails: this.props.location.type == 'details' ? true : false,

    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false })
    }
    closeFormModal = () => {

        this.setState({ showForm: false })
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

            let UserID = null, FirstName = null, LastName = null, SMS = null, Email = null, Phone = null, UserName = null, Password = null, Dock = null, docName = null
            if (type === 'Add')
                UserID = 1
            else
                UserID = object.UserID
            if (object.FirstName !== '')
                FirstName = object.FirstName
            if (object.LastName !== '')
                LastName = object.LastName
            if (object.SMS !== '')
                SMS = object.SMS
            if (object.Email !== '')
                Email = object.Email
            if (object.Phone !== '')
                Phone = object.Phone
            if (object.UserName !== '')
                UserName = object.UserName
            if (object.Password !== '')
                Password = object.Password
            if (object.add) {
                docName = object.document
                Dock = object.add;
            }
            let newObj = new RenterObject(UserID, FirstName, LastName, SMS, Email, Phone, 3, UserName, Password, document, docName);
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
            LinksForTable: [<button onClick={() => { this.setState({ showForm: true }) }} showForm={() => {

                return this.state.showForm && <Form closeModal={this.closeFormModal} isOpen={this.state.showForm} fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                    LinksForEveryRow={[]} ButtonsForEveryRow={[]}
                    fieldsToAdd={[]} setForForm={this.setForForm}
                    validate={this.validate} />
            }}>הוספת שוכר </button>
            ],
            ButtonsForTable: [],
        }
    }
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = object => {
        const docks = postFunction('User/GetUserDocuments', { id: object.UserID, type: 4 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)


        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: postFunction('Renter/getPropertiesbyRenterID', object.OwnerID),
            type: 'table'
        }}>
            דירות ששוכר</Link>]
        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow, object,
            ButtonsForEveryRow: ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details object={this.props.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }
        else if (this.props.location.type === 'form') {

            return <Form closeModal={this.closeDetailsModal} isOpen={this.state.showDetails}
                closeModal={this.closeFormModal} isOpen={this.state.showForm}
                Object={this.props.location.object}
                name={this.props.location.formName}
                type={this.props.location.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                LinksPerObject={[]} LinksForEveryRow={[]}
                ButtonsForEveryRow={[]} fieldsToAdd={[]} validate={this.props.location.validate} />
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
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/a' />}

            </div>

        )
    }
}

export default connect(mapStateToProps)(Renter);
export const rentersList = [];//GetFunction('Renter/GetAllRenters');