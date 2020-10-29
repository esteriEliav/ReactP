
import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import Form from '../General/Form'
import Properties from './Properties'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions, CommonFunction, GetFunction, postFunction, Search } from '../General/CommonFunctions';
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
        { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g }
            , { field: 'UserName', name: 'שם משתמש', type: 'text' }, { field: 'Password', name: 'סיסמא', type: 'text' }],
        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.rentersList,
        // [{ UserID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
        // { UserID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
        // { UserID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }],

        fieldsToSearch: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' }, { field: 'LastName', name: 'שם משפחה', type: 'text' },
        { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel' }],
        isAutho: true,
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showSomthing: null,
        docks: [],
        objects: []

    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        // if (object.SMS === '' && object.Email === '') {
        //     generalEror = 'SMS חובה להכניס אימייל או '
        //     isErr = true
        // }
        if (!object.Email || object.Email === '') {
            erors.Email = 'חובה להכניס אימייל'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }
    submitSearch = (object) => {
        const path = 'Renter/Search';

        if (object) {
            let objects = Search(object, path)
            let name = 'תוצאות חיפוש'
            if (objects === null || objects === []) {
                objects = []
                name = 'לא נמצאו תוצאות'
            }
            this.setState({ objectsArray: objects, name })
        }
    }
    submit = async (type, object) => {
        ;
        let path = 'User/' + type + 'User';
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
            const con = window.confirm('למחוק שוכר?')
            if (con === false)
                return;
            object = { id: object.UserID }
        }
        const res = await CommonFunctions(type, object, path)
            ;
        if (res && res !== null) {
            this.closeFormModal();
        }
    }

    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'שוכרים')
            LinksForTable = [<button type='button' onClick={() => { this.setState({ ObjectsArray: this.props.rentersList, name: 'שוכרים' }) }}>חזרה לשוכרים</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                            fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                            setForForm={this.setForForm}
                            validate={this.validate} />
                })
            }} >הוספת שוכר </button>,
            <button onClick={() => {
                const con = window.confirm('לשלוח?')
                if (con === true) {
                    let res;
                    GetFunction('מה שם הפונקציה?').then(r => res = r);
                    if (res)
                        alert("נשלח")
                    else
                        alert("תקלה... לא נשלח")
                }
            }}>שליחת שם משתמש וסיסמא לכל השוכרים</button>]
        return { LinksForTable }





    }
    setForForm = object => {
        const fieldsToAdd = [{ field: 'document', name: 'מסמכים', type: 'file', index: 'end' }]
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {

        postFunction('Renter/getPropertiesbyRenterID', { id: object.OwnerID }).then(res => this.setState({ properties: res }))
        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let fieldsToAdd = [];
        let LinksForEveryRow = [<Link
            to={{ pathname: '/Properties', objects: this.state.properties }}>דירות ששוכר</Link>]
        postFunction('User/GetUserDocuments', { id: object.UserID, type: 4 }).then(res => this.setState({ docks: res }))
        if (this.state.docks && this.state.docks[0]) {
            fieldsToAdd.push({ field: 'document', name: 'מסמכים', type: 'file', index: 'end' })
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        }
        return {
            fieldsToAdd, LinksForEveryRow: LinksForEveryRow, object, enable: true,
            ButtonsForEveryRow: ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    rend = () => {


        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            return <Details Object={this.props.object} isOpen={this.props.isOpen} closeModal={this.props.closeModal}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }
        else if (this.props.type === 'form') {

            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate} />
        }
        else {

            return <div><Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />{this.state.showSomthing}</div>
        }
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
// export const rentersList = [{ UserID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
// { UserID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
// { UserID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }]
// GetFunction('Renter/GetAllRenters');