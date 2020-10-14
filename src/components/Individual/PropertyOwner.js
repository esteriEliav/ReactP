import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import MPropertyForRenterain1 from './PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions } from '../General/CommonFunctions';
import PropertyOwnerObject from '../../Models-Object/PropertyOwnerObject';


export class PropertyOwner extends Component {
    obj=[]
    componentDidMount=()=>{

    Axios.get('PropertyOwner/getAllOwners').then(res=>{this.obj=res.data})
}
    state = {

        name: 'משכירים',
        fieldsArray: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
        { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }],
        ObjectsArray:this.obj  /*[{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
        { OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
        { OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }],
*/,
        // fieldsToSearch: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        // { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
    }

    submit = (type, object) => {
        debugger;
        let path = 'PropertyOwner/' + type
        path += type !== 'Search' ? 'PropertyOwner' : ''
        if (type === 'Add' || type === 'Update') {
            let newObj = PropertyOwnerObject()
            if (type === 'Add')
                newObj.OwnerID = 1
            else
                newObj.OwnerID = object.OwnerID
            if (object.OwnerFirstName !== '')
                newObj.OwnerFirstName = object.OwnerFirstName
            if (object.OwnerLastName !== '')
                newObj.OwnerLastName = object.OwnerLastName
            if (object.Phone !== '')
                newObj.Phone = object.Phone
            if (object.Email !== '')
                newObj.Email = object.Email

            object = newObj

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
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, submit: this.submit, type: 'Add', name: 'הוספת משכיר',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: [], setForForm: this.setForForm,
                validate: this.validate
            }}> הוספת משכיר</Link>
            ],
            ButtonsForTable: [],
        }
    }
    setForForm = object => []
    set = (object) => {
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]
        let LinksPerObject = [<Link to={{//שולח  רשימת דירות שמתקבלים מהפונקציה
            pathname: '/Properties',
            objects: Axios.post('PropertyOwner/GetPropertiesbyOwnerID', object.OwnerID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                .then(res => res.data),
            type: 'table'
        }}>
            דירות</Link>]
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
                set={this.set} delObject={this.deleteObject}
                validate={this.validate} submit={this.submit}
                fieldsToSearch={this.state.fieldsArray} />

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
export const ownersList = [{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
{ OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
{ OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }]//Axios.get('PropertyOwner/getAllOwners').then(res => res.data)