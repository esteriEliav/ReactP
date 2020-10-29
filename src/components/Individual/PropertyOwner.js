import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import Form from '../General/Form'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunction, CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
import PropertyOwnerObject from '../../Models-Object/PropertyOwnerObject';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import { Properties } from './Properties'



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
        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : ownersList,
        showForm: false,
        showDetails: false,
        showSomthing: null,

        docks: null,
        properties: null

        // fieldsToSearch: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        // { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
    }
    submitSearch = (object) => {
        const path = 'PropertyOwner/Search';

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

        let path = 'PropertyOwner/' + type + 'PropertyOwner';

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



        }
        else if (type === 'Delete') {
            object = { id: object.OwnerID }
        }
        const res = await CommonFunctions(type, object, path)
            ;
        if (res && res !== null) {
            this.closeFormModal();
        }
    }



    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (!((object.Phone && object.Phone !== '') || (object.Email !== '' && object.Email))) {
            generalEror = 'חובה להכניס אימייל או טלפון'
            isErr = true
        }

        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }
    setForTable = () => {
        let LinksForTable = []

        if (this.state.name !== 'משכירים')
            LinksForTable = [<button type='button' type='button' onClick={() => { this.setState({ ObjectsArray: ownersList, name: 'משכירים' }) }}>חזרה למשכירים</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }} > הוספת משכיר</button>]
        return {
            LinksForTable,

        }
    }
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {

        let properties = null

        let ButtonsForEveryRow = []
        let LinksPerObject = []
        postFunction('PropertyOwner/GetPropertiesbyOwnerID', { id: this.props.user.UserID }).then(res => this.setState({ properties: res }))
        let res = this.state.properties
        res = res !== null ? res : [];
        let LinksForEveryRow = [<Link 
            to={{
                pathname: '/Properties', objects: res
            }} >דירות</Link>]


            ;
        postFunction('User/GetUserDocuments', { id: object.OwnerID, type: 2 }).then(res => this.setState({ dock: res }))
        console.log('this.state.docks', this.state.docks)
        if (this.state.docks && this.state.docks[0])
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        return {
            fieldsToAdd: [], LinksForEveryRow, object, enable: true,
            ButtonsForEveryRow, LinksPerObject
        }
    }
    rend = () => {

        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
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
                validate={this.validate} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsArray.filter((i, ind) => ind != 4)} />
                {this.state.showSomthing}</div>
        }
    }
    render() {
        ;
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
export const ownersList =
    //GetFunction('PropertyOwner/getAllOwners')
    [{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
    { OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
    { OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }];
