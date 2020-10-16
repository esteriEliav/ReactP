import React, { Component } from 'react'
import Table from "../General/Table";
import Form from '../General/Form'

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import SubPropertyObject from '../../Models-Object/SubPropertyObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'


/*
SubPropertyID int  not null identity,--קוד נכס בן
PropertyID int not null,--נכס אב
num int not null,
Size float null,--תוספת
RoomsNum float null,--תוספת
-- הוספת שדה מס תת דירה לתת נכסים

-- הוספת שדה האם מושכר לתת נכסים
IsRented bit not null constraint DF_SubProperties_IsRented default 0
*/


export class SubProperties extends Component {


    state = {
        name: 'תת נכסים',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text', readonly: true },
        { field: 'num', name: 'מספר', type: 'text', required: true }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsRented', name: 'מושכר?', type: 'checkbox' }],
        ObjectsArray:/*SubPropertiesList */[{ SubPropertyID: 1, PropertyID: 3, num: 2, Size: 150, RoomsNum: 2, IsRented: false }],//

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' },
        { field: 'num', name: 'מספר', type: 'text' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' }],
        isAutho: false//true

    }

    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.RoomsNum !== '' && !(parseFloat(object.RoomsNum).toString() === object.RoomsNum)) {

            erors.RoomsNum = 'נא להקיש מספר'
            isErr = true
        }
        if (object.Size !== '' && !(parseFloat(object.Size).toString() === object.Size)) {
            erors.Size = 'נא להקיש מספר'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submit = (type, object) => {
        let path = 'SubProperty/' + type
        path += type !== 'Search' ? 'SubProperty' : ''
        if (type === 'Add' || type === 'Update') {
            let newObj = SubPropertyObject()
            if (type === 'Add')
                newObj.SubPropertyID = 1
            else
                newObj.SubPropertyID = object.SubPropertyID
            newObj.PropertyID = object.PropertyID
            newObj.num = object.num
            newObj.IsRented = object.IsRented
            if (object.Size !== '')
                newObj.Size = parseFloat(object.Size)
            if (object.RoomsNum !== '')
                newObj.RoomsNum = parseFloat(object.RoomsNum)
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add
            }

            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.SubPropertyID)
            object = id
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/SubProperties', path)
    }


    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
    setForTable = () => {
        return {
            LinksForTable: [],
            ButtonsForTable: []
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
        let LinksPerObject = []


        const docks = postFunction('User/GetUserDocuments', { id: object.id, type: 5 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)

        let tempobject = object;
        object.PropertyID = <Link
            to={{
                pathname: '/Properties',
                object: postFunction('Propety/GetPropertyByID', object.PropertyID),
                type: 'details'
            }}
        ></Link>

        if (object.IsRented) {
            tempobject.IsRented = <Link
                to={{
                    pathname: '/Rentals',
                    object: postFunction('Property/GetRentalBySubPropertyID', object.SubPropertyID),
                    type: 'details'
                }}
            >v</Link>//שולח פרטי השכרה שמתקבלים מהפונקציה
            LinksPerObject.push(<Link
                to={{
                    pathname: '/Rentals',
                    type: 'form',
                    object: { PropertyID: object.PropertyID, SubPropertyID: object.SubPropertyID },
                    formName: 'הוסף',
                    formType: 'Add'
                }}
            >v</Link>)



        }
        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow,
            object: tempobject, LinksPerObject: []
        };
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
        else if (this.props.location.type === 'form') {

            return <Form location={{
                Object: this.props.location.object,
                name: this.props.location.formName,
                type: this.props.location.formType,
                fieldsArray: this.state.fieldsArray,
                submit: this.submit, setForForm: this.setForForm,
                LinksPerObject: [], LinksForEveryRow: [], ButtonsForEveryRow: [], fieldsToAdd: [], validate: this.props.location.validate
            }} />
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
                {/* {this.props.location.authorization()} */}
                {this.rend()}
            </div>
        )
    }

}

export default connect(mapStateToProps)(SubProperties);
export const SubPropertiesList = [];// GetFunction('SubProperty/GetAllSubProperties');
