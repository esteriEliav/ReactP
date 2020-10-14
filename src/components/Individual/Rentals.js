import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import { RenterList } from './Renter';
import { propertyList } from './Properties';
import { CommonFunctions } from '../General/CommonFunctions';
import RentalObject from '../../Models-Object/RentalObject';


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
    PaymentTypeOptions = Axios.get('Rental/GetAllPaymentTypes').then(res => res.data)
    renters = RenterList.map(item => { return { id: item.OwnerID, name: item.FirstName + ' ' + item.LastName } })//.then(res => res.
    state = {
        name: 'השכרות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text', readonly: true }, { field: 'UserID', name: 'שוכר', type: 'select', /*selectOptions: this.renters*/ },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio', /*radioOptions: this.PaymentTypeOptions,*/ required: true }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שם שוכר ', type: 'text' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }],
        ObjectsArray:this.obj /*[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
        { RentalID: 3, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }],//
*/

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


            object = newObj

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
    setForForm = object => []
    set = (object) => {
        const ownerobject = {}// Axios.post('PropertyOwner/GetOwnerByID', object.OwerID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        // .then(res => res.data)
        let LinksPerObject = [<Link to={{
            pathname: '/PropertyOwner',
            Object: ownerobject,
            type: 'details'
        }}>{ownerobject.OwnerFirstName + ' ' + ownerobject.OwnerLastName}:בעלים</Link>];
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]
        object.PropertyID = <Link
            to={{
                pathname: '/Properties',
                object: Axios.post('Property/GetPropertyByID', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }),
                type: 'details'
            }}>
            {object.PropertyID}</Link>

        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link
                to={{
                    pathname: '/SubProperties',
                    object: Axios.post('SubProperty/GetSubPropertyByID', object.SubPropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data),
                    type: 'details'
                }}>נכס מחולק</Link>)

        const userObject = Axios.post('Renter/GetRenterByID', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data)
        object.UserID = <Link
            to={{
                pathname: '/Details',
                object: userObject,
                type: 'details'
            }}>
            {userObject.FirstName + ' ' + userObject.LastName}</Link>

        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, object: object,
            LinksPerObject: LinksPerObject
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
        else
            return <Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
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

export default Rentals
