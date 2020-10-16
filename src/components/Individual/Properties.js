import React, { Component } from 'react'
import Table from '../General/Table'
import Form from '../General/Form'

import { Link, Redirect } from 'react-router-dom';
import Axios from '../Axios'
import Details from '../General/Details';
import { ownersList } from './PropertyOwner'
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import PropertyObject from '../../Models-Object/PropertyObject';
import DocumentObject from '../../Models-Object/DocumentObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'



/*PropertyID int  not null identity,
OwnerID int not null,
CityID int not null,
CityName nvarchar(max) not null,
StreetID int not null,
StreetName nvarchar(max) not null,
Number nvarchar(5) not null,

"Floor" int,
ApartmentNum int null,--תוספת
Size float,--גודל דירה
RoomsNum float null,--תוספת
IsDivided bit not null constraint DF_Properties_IsDivided default 0,
ManagmentPayment float,--דמי ניהול
IsPaid bit not null constraint DF_Properties_IsPaid default 0,
IsRented bit not null constraint DF_Properties_IsRented default 0,
IsExclusivity bit not null constraint DF_Properties_IsExclusivity default 0,
ExclusivityID int,
IsWarranty bit not null constraint DF_Properties_IsWarranty default 0,-- האם באחריות 
*/
export class Properties extends Component {
    owners = ownersList.map(item => { return { id: item.OwnerID, name: item.OwnerFirstName + ' ' + item.OwnerLastName } })
    exclusivityPersons = GetFunction('Property/GetAllexclusivityPersons').map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } })

    state = {
        name: 'דירות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text', readonly: true }, { field: 'OwnerID', name: 'בעלים', type: 'select', /*selectOptions: this.owners,*/ required: true }, { field: 'CityName', name: 'עיר', type: 'text', required: true },
        { field: 'StreetName', name: 'רחוב', type: 'text', required: true }, { field: 'Number', name: 'מספר', type: 'text', required: true, pattern: '[1-9][0-9]*[A-Ca-cא-ג]?' }, { field: 'Floor', name: 'קומה', type: 'number', required: true },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsRented', name: 'מושכר', type: 'checkbox' }, { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' },
        { field: 'document', name: 'מסמך', type: 'file', index: 'end' }],


        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'checkbox' }],

        ObjectsArray:/*propertiesList*/[{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        { PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: false, IsRented: false, IsExclusivity: false }],//
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
        if (object.ManagmentPayment !== '' && !(parseFloat(object.ManagmentPayment).toString() === object.ManagmentPayment)) {
            erors.ManagmentPayment = 'נא להקיש מספר'
            isErr = true
        }
        debugger;
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }

    submit = (type, object) => {
        debugger
        let path = 'Property/' + type
        path += type !== 'Search' ? 'Property' : ''

        if (type === 'Add' || type === 'Update') {
            let newObj = PropertyObject();
            if (type === 'Add')
                newObj.PropertyID = 1
            else
                newObj.PropertyID = object.PropertyID;
            newObj.CityName = object.CityName
            //newObj..CityID=
            newObj.StreetName = object.StreetName
            //newObj..StreetID=
            newObj.Number = object.Number
            if (object.Floor !== '')
                newObj.ApartmentNum = object.Floor
            if (object.Floor !== '')
                newObj.ApartmentNum = object.ApartmentNum
            if (object.Size !== '')
                newObj.Size = object.Size
            if (object.IsDivided !== '')
                newObj.IsDivided = object.IsDivided
            if (object.ManagmentPayment !== '')
                newObj.ManagmentPayment = object.ManagmentPayment
            newObj.IsPaid = object.IsPaid
            newObj.IsRented = object.IsRented
            newObj.IsExclusivity = object.IsExclusivity
            if (object.exclusivityPersons !== '')
                newObj.exclusivityPersons = object.exclusivityPersonsnpm
            newObj.IsWarranty = object.IsWarranty
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }

            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.propertyID)
            object = id
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/Properties', path)
    }



    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, submit: this.submit, type: 'Add', name: ' הוספת דירה',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: [], setForForm: this.setForForm,
                validate: this.validate
            }}>הוספת נכס </Link>],

            ButtonsForTable: [],

        }
    }
    linkToAddPropertyOwner = <Link to={{
        pathname: '/PropertyOwner',
        type: 'Add',
        name: 'הוסף משכיר',
        index: 1,
        object: {}

    }}> הוסף משכיר</Link>

    set = (object) => {    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
        let LinksPerObject = []
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]
        let tempobject = { ...object };
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        //const docks=postFunction('')
        const ownerobject = {}// postFunction('PropertyOwner/GetOwnerByID', object.OwerID)

        if (object.IsDivided) {
            tempobject.IsDivided = <Link to={{
                pathname: '/SubProperties',
                objects: postFunction('SubProperty/GetSubPropertiesOfParentProperty', object.PropertyID),
                type: 'table'
            }} >V</Link>//ששולח פרטי נכסי בן של הדירה
            LinksPerObject.push(<Link to={{
                pathname: '/SubProperty',
                type: 'Add',
                name: 'הוסף נכס מחולק',
                index: 8,
                object: { propertyID: tempobject.propertyID }

            }}>הוסף נכס מחולק</Link>)

        }

        else
            tempobject.IsDivided = 'X'

        const rentalObject = postFunction('Property/GetRentalByPropertyID', object.propertyID)
        if (object.IsRented) {
            tempobject.IsRented = <Link to={{
                pathname: '/Rentals',
                objects: rentalObject,
                type: 'table'
            }}>V</Link>//ושולח פרטי השכרה שמתקבלים מהפונקציה
            LinksPerObject.push(<Link to={{
                pathname: '/Rentals',
                type: 'form',
                name: 'הוסף השכרה',
                index: 8,
                object: { propertyID: tempobject.propertyID }

            }}>הוסף השכרה</Link>)
        }
        else
            tempobject.IsDivided = 'X'

        const docks = postFunction('User/GetUserDocuments', { id: object.id, type: 1 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        tempobject.OwnerID = <Link to={{
            pathname: '/PropertyOwner',
            Object: ownerobject,
            type: 'details'
        }}>
            {ownerobject.firstName + ' ' + ownerobject.lastName}</Link>
        return {
            fieldsToAdd: this.setForForm(object).fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, object: tempobject
            , LinksPerObject: LinksPerObject
        };

    }
    setForForm = (object) => {
        let fieldsToAdd = []
        let LinksPerObject = [this.linkToAddPropertyOwner]
        console.log('IsExclusivity', object.IsExclusivity)
        if (object.IsExclusivity)
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select',/* selectOptions: this.exclusivityPersons,*/ index: 13 })
        return { fieldsToAdd, LinksPerObject }

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
                name: this.props.location.name,
                type: this.props.location.type,
                fieldsArray: this.state.fieldsArray,
                submit: this.submit, setForForm: this.setForForm,
                LinksPerObject: [], LinksForEveryRow: [this.linkToAddPropertyOwner]
                , ButtonsForEveryRow: [], fieldsToAdd: [], validate: this.props.location.validate
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

export default connect(mapStateToProps)(Properties)


export const propertiesList = [];//GetFunction('Property/GetAllProperties');

