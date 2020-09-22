import React, { Component } from 'react'
import Table from '../General/Table'
import { Link } from 'react-router-dom';
import Axios from "../Axios";

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
    submit = (name, object) => {
        if (name === 'הוסף')
            this.addObject(object)
        else
            this.updateObject(object)
    }
    updateObject = (object) => {
        Axios.post('Rental/UpdateRental', object).then(x => { alert('השכירות נוספה בהצלחה') });
    }
    addObject = (object) => {
        object.RentalID = 1;
        Axios.post('Rental/AddRental', object).then(x => { alert('השכירות נוספה בהצלחה') });
    }
    deleteObject = (object) => {
        Axios.post('Rental/DeleteRental', object).then(x => { alert('השכירות נמחקה בהצלחה') });
    }
    state = {
        name: 'השכרות',
        fieldsPropertyArray: [{ field: 'RentalID', name: 'קוד שכירות', type: 'text' }, { field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שוכר', type: 'text' },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שם שוכר ', type: 'text' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }],
        PropertiesArray: [{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
        { RentalID: 3, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: true }],//
        LinksForEveryRow: [{ name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ name: ' הוספת שכירות', link: '/Form' }],
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
        // let fieldsToAdd = [];
        //let ButtonsForEveryRow=[this.state.ButtonsForEveryRow];
        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link>נכס מחולק</Link>)//קישור לנכס והאוביקט הוא מה שמתקבל מפרטי אב 
        //LinksForEveryRow.push({ name: 'נכס מחולק', link: '/details', index: 6 })//קישןר לפרטי תת הנכס ולנכס אב
        // LinksForEveryRow.push({ name: 'לפרטי דירה', link: '', index: 6 })
        //else

        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, object: object,
            LinksPerObject: LinksPerObject
        };

    }
    render() {
        return (
            <div>
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    LinksForTable={this.state.LinksForTable}
                    ButtonsForTable={this.state.ButtonsForTable} fieldsToAdd={this.state.fieldsToAdd}
                    set={this.set} delObject={this.deleteObject}
                    validate={this.validate} erors={this.state.erors} submit={this.submit}
                    fieldsToSearch={this.state.fieldsToSearch} />
            </div>
        )



    }
}

export default Rentals
