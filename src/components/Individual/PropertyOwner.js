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
import PropertyOwnerObject from '../../Models-Object/PropertyOwnerObject';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'



export class PropertyOwner extends Component {
    obj = []
    componentDidMount = () => {

        Axios.get('PropertyOwner/getAllOwners').then(res => { this.obj = res.data })
    }
    state = {

        name: 'משכירים',
        fieldsArray: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
        { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'document', name: ' מסמך', type: 'file', index: 'end' }],
        ObjectsArray: ownersList,
        showForm: this.props.location.type == 'form' ? true : false,
        showDetails: this.props.location.type == 'details' ? true : false,


        isAutho: true//false

        // fieldsToSearch: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        // { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false })
    }
    closeFormModal = () => {

        this.setState({ showForm: false })
    }
    submit = (type, object) => {
        debugger;
        let path = 'PropertyOwner/' + type
        path += type !== 'Search' ? 'PropertyOwner' : ''
        if (type === 'Add' || type === 'Update') {
            let OwnerID = object.OwnerID, OwnerFirstName = null, OwnerLastName = null, Phone = null, Email = null, Dock = null, docName = null

            if (type === 'Add')
                OwnerID = 1
            if (object.OwnerFirstName !== '')
                OwnerFirstName = object.OwnerFirstName
            if (object.OwnerLastName !== '')
                OwnerLastName = object.OwnerLastName
            if (object.Phone !== '')
                Phone = object.Phone
            if (object.Email !== '')
                Email = object.Email
            if (object.add !== '') {
                docName = object.document
                Dock = object.add;

            }

            object = new PropertyOwnerObject(OwnerID, OwnerFirstName, OwnerLastName, Phone, Email, Dock, docName)
            debugger

            window.open(object.document);



        }
        else if (type === 'Delete') {
            object.OwnerID = 1
            let id = new Number(object.OwnerID)
            object = id
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/PropertyOwner', path)
    }



    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.Phone === '' && object.Email === '') {
            generalEror = 'חובה להכניס אימייל או טלפון'
            isErr = true
        }

        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }
    setForTable = () => {
        const LinksForTable = [<button onClick={() => { this.setState({ showForm: true }) }} showForm={() => {

            return this.state.showForm && <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                LinksForEveryRow={[]} ButtonsForEveryRow={[]}
                fieldsToAdd={[]} setForForm={this.setForForm}
                validate={this.validate} />
        }}


        > הוספת משכיר</button>
        ]
        return {
            LinksForTable,
            ButtonsForTable: [],
        }
    }
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {

        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: postFunction('PropertyOwner/GetPropertiesbyOwnerID', Number(object.OwnerID)),
            type: 'table'
        }}>
            דירות</Link>]
        //LinksPerObject.push(<input type="file" name="file" onChange={onChangeHandler} />

        const docks = postFunction('User/GetUserDocuments', { id: object.PropertyOwnerID, type: 2 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow, object: object,
            ButtonsForEveryRow: ButtonsForEveryRow, LinksPerObject: LinksPerObject
        }
    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.closeDetailsModal} isOpen={this.state.showDetails}
                object={this.props.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }
        else if (this.props.location.type === 'form') {

            return <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                Object={this.props.location.object}
                name={this.props.location.formName}
                type={this.props.location.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                LinksPerObject={[this.linkToAddPropertyOwner]} LinksForEveryRow={[]}
                ButtonsForEveryRow={[]} fieldsToAdd={[]} validate={this.props.location.validate} />
        }
        else {

            return <Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} submit={this.submit}
                fieldsToSearch={this.state.fieldsArray.filter((i, ind) => ind != 4)} />
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

export default connect(mapStateToProps)(PropertyOwner);
export const ownersList =/*GetFunction('PropertyOwner/getAllOwners')*/[{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
{ OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
{ OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }];