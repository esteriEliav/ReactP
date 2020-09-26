import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';


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
    submit = (type, object) => {
        let x = false;
        if (type === 'Add')
            x = this.addObject(object)
        else if (type === 'Update')
            x = this.updateObject(object)
        else
            x = this.Search(object)
        if (x)
            return <Redirect to='/Rentals' />
        return null;
    }
    Search = (object) => {
        Axios.post('Rental/Search', { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        Axios.post('Rental/UpdateRental', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('השכירות נוספה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        object.RentalID = 1;
        Axios.post('Rental/AddRental', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('השכירות נוספה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = (object) => {
        Axios.post('Rental/DeleteRental', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('השכירות נמחקה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    state = {
        name: 'השכרות',
        fieldsRentalsArray: [{ field: 'RentalID', name: 'קוד שכירות', type: 'text' }, { field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שוכר', type: 'text' },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שם שוכר ', type: 'text' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }],
        RentalsArray:/* Axios.get('Rental/GetAllRentals')*/[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
        { RentalID: 3, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: true }],//
        LinksForEveryRow: [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ type: 'Add', name: ' הוספת שכירות', link: '/Form' }],
        ButtonsForEveryRow: [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }],
        ButtonsForTable: [],
        fieldsToAdd: [],
        erors: []

    }
    validate = (Number) => {
        let erors = []
        if (Number < 1)
            erors.push({ name: 'ערך לא חוקי', index: 4 })
        if (erors.length > 0) {
            this.setState({ erors: erors })
            return true
        }
        return false
    }
    //אמורה להיות פונקציה שממפה עבור כל איידי את השם


    set = (object) => {
        let LinksForEveryRow = [...this.state.LinksForEveryRow];
        let LinksPerObject = [];

        object.PropertyID = <Link
            to={{
                pathname: '/Properties',
                object: Axios.post('Property/GetPropertyByPropertyID', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }),
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

        const userObject = Axios.post('PropertyOwner/GetOwnerByID', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data)
        object.UserID = <Link
            to={{
                pathname: '/Details',
                object: userObject,
                type: 'details'
            }}>
            {userObject.FirstName + ' ' + userObject.LastName}</Link>

        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, object: object,
            LinksPerObject: LinksPerObject
        };

    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details location={{
                object: this.props.object,
                fieldsArray: this.state.fieldsRentalsArray,
                LinksPerObject: some.LinksPerObject,
                LinksForEveryRow: some.LinksForEveryRow,
                ButtonsForEveryRow: some.ButtonsForEveryRow,
                fieldsToAdd: some.fieldsToAdd
            }}
            />

        }
        else
            return <Table name={this.state.name} fieldsArray={this.state.fieldsRentalsArray} objectsArray={this.state.RentalsArray}
                LinksForTable={this.state.LinksForTable} ButtonsForTable={this.state.ButtonsForTable}
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
