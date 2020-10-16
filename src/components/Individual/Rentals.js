import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import { rentersList } from './Renter';
import { propertyList } from './Properties';
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import RentalObject from '../../Models-Object/RentalObject';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import Form from '../General/Form'


/*
RentalID int  not null identity,
PropertyID int not null,
SubPropertyID int,
UserID int,--שוכר
RentPayment float,
PaymentTypeID int,
EnteryDate datetime,--תאריך תחילת חוזה
EndDate datetime,--תאריך סיום
ContactRenew bit constraint DF_Rentals_ContactRenew default 0,--האם לחדש חוזה
*/
export class Rentals extends Component {
    obj=[]
    componentDidMount=()=>{

        Axios.get('Rental/GetAllRentals').then(res=>{this.obj=res.data
            debugger;
            console.log('res.data',res.data)},res=>{console.log('res.data',res)})
        console.log('obj',this.obj)
    }
    
    PaymentTypeOptions = GetFunction('Rental/GetAllPaymentTypes')
    renters = rentersList.map(item => { return { id: item.OwnerID, name: item.FirstName + ' ' + item.LastName } })

    state = {
        name: 'השכרות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text', readonly: true }, { field: 'UserID', name: 'שוכר', type: 'select', /*selectOptions: this.renters*/ },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio', /*radioOptions: this.PaymentTypeOptions,*/ required: true }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }, , { field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שם שוכר ', type: 'text' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }],

        /*[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },*/

        ObjectsArray:/*rentalsList*/[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },

        { RentalID: 3, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }],//
        isAutho: false//true


    }

    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.RentPayment !== '' && !(parseFloat(object.RentPayment).toString() === object.RentPayment)) {

            erors.RentPayment = 'נא להקיש מספר'
            isErr = true
        }
        if (object.EnteryDate > object.EndDate) {
            generalEror = 'תאריך כניסה מאוחר מתאריך יציאה'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submit = (type, object) => {
        let path = 'Rental/' + type
        path += type !== 'Search' ? 'Rental' : ''
        if (type === 'Add' || type === 'Update') {
            let newObj = RentalObject()
            if (type === 'Add')
                newObj.RentalID = 1
            else
                newObj.RentalID = object.RentalID
            newObj.PropertyID = object.PropertyID
            newObj.SubPropertyID = object.SubPropertyID
            if (object.Phone !== '')
                newObj.UserID = object.UserID
            if (object.RentPayment !== '')
                newObj.RentPayment = parseFloat(object.RentPayment)
            newObj.PaymentTypeID = object.PaymentTypeID
            if (object.EnteryDate !== '')
                newObj.EnteryDate = object.EnteryDate
            if (object.EndDate !== '')
                newObj.EndDate = object.EndDate
            newObj.ContactRenew = object.ContactRenew
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }
            debugger;
            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.RentalID)
            object = id
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/Rentals', path)
    }

    //אמורה להיות פונקציה שממפה עבור כל איידי את השם

    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, erors: [], submit: this.submit, type: 'Add', name: ' הוספת שכירות',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: [], setForForm: this.setForForm, validate: this.validate
            }}> הוספת השכרה</Link>],
            ButtonsForTable: []
        }
    }
    linkToAddRenter = <Link to={{
        pathname: '/Properties',
        type: 'Add',
        name: 'הוסף',
        index: 0,
        object: {}
    }}>הוסף נכס</Link>
    linkToAddProperty = <Link to={{
        pathname: '/Renter',
        type: 'Add',
        name: 'הוסף',
        index: 1,
        object: {}
    }}>הוסף שוכר</Link>
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = [this.linkToAddRenter, this.linkToAddProperty]
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {
        const ownerobject = {}// postFunction('PropertyOwner/GetOwnerByID', object.OwerID) 
        let LinksPerObject = [<Link to={{
            index: 'end',
            pathname: '/PropertyOwner',
            Object: ownerobject,
            type: 'details'
        }}>{ownerobject.OwnerFirstName + ' ' + ownerobject.OwnerLastName}:בעלים</Link>];
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]

        const docks = postFunction('User/GetUserDocuments', { id: object.id, type: 3 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)


        object.PropertyID = <Link
            to={{
                pathname: '/Properties',
                object: postFunction('Property/GetPropertyByID', object.PropertyID),
                type: 'details'
            }}>
            {object.PropertyID}</Link>

        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link
                to={{
                    index: 'end',
                    pathname: '/SubProperties',
                    object: postFunction('SubProperty/GetSubPropertyByID', object.SubPropertyID),
                    type: 'details'
                }}>נכס מחולק</Link>)

        const userObject = postFunction('Renter/GetRenterByID', object.PropertyID)
        object.UserID = <Link
            to={{
                pathname: '/Details',
                object: userObject,
                type: 'details'
            }}>
            {userObject.FirstName + ' ' + userObject.LastName}</Link>

        return {
            fieldsToAdd: [], LinksForEveryRow,
            ButtonsForEveryRow, object,
            LinksPerObject
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
                LinksPerObject: [], LinksForEveryRow: [<Link to={{
                    pathname: '/Properties',
                    type: 'Add',
                    name: 'הוסף',
                    index: 0,
                    object: {}
                }}>הוסף נכס</Link>,
                <Link to={{
                    pathname: '/Renter',
                    type: 'Add',
                    name: 'הוסף',
                    index: 1,
                    object: {}
                }}>הוסף שוכר</Link>],
                ButtonsForEveryRow: [], fieldsToAdd: [], validate: this.props.location.validate
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

export default connect(mapStateToProps)(Rentals)
export const rentalsList = [];// GetFunction('Rental/GetAllRentals');