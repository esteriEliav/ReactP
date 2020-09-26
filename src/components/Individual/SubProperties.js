import React, { Component } from 'react'
import Table from "../General/Table";
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';

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
    submit = (type, object) => {
        let x = false;
        if (type === 'Add')
            x = this.addObject(object)
        else if (type === 'Update')
            x = this.updateObject(object)
        else
            x = this.Search(object)
        if (x)
            return <Redirect to='/SubProperties' />
        return null;
    }
    Search = (object) => {
        Axios.post('SubProperty/Search', { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        Axios.post('SubProperty/UpdateSubProperty', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert("הדירה נשמרה בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        object.subPropertyID = 1;
        Axios.post('SubProperty/AddSubProperty', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(x => { alert('הדירה עודכנה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = () => {
        window.confirm("האוביקט ימחק מיד");
    }
    state = {
        name: 'תת נכסים',
        fieldsPropertyArray: [{ field: 'SubPropertyID', name: 'קוד דירה', type: 'text' }, { field: 'PropertyID', name: 'בעלים', type: 'text' },
        { field: 'num', name: 'עיר', type: 'text' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsRented', name: 'רחוב', type: 'text' }],
        PropertiesArray:/* Axios.get('SubProperty/GetAllSubProperties')*/[{ SubPropertyID: 1, PropertyID: 3, num: 2, Size: 150, RoomsNum: 2, IsRented: false }],//
        LinksForEveryRow: [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ type: 'Add', name: ' הוספת דירה', link: '/Form' }],
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

    // setForAddCommonLinks = (LinksForEveryRow, LinksForTable, ButtonsForEveryRow) =>
    //  this.setState({ LinksForEveryRow: LinksForEveryRow, LinksForTable: LinksForTable, ButtonsForEveryRow: ButtonsForEveryRow })
    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים

    set = (object) => {

        let LinksForEveryRow = [...this.state.LinksForEveryRow];
        let fieldsToAdd = [];
        let tempobject = object;
        object.PropertyID = <Link
            to={{
                pathname: '/Properties',
                object: Axios.post('Propety/GetPropertyByID', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data),
                type: 'details'
            }}
        ></Link>

        if (object.IsRented)
            tempobject.IsRented = <Link
                to={{
                    pathname: '/Rentals',
                    object: Axios.post('Property/GetRentalBySubPropertyID', object.SubPropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data),
                    type: 'details'
                }}
            >v</Link>//שולח פרטי השכרה שמתקבלים מהפונקציה
        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow,
            object: tempobject, LinksPerObject: []
        };
    }
    rend = () => {
        if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details location={{
                object: this.props.object,
                fieldsArray: this.state.fieldsPropertyArray,
                LinksPerObject: some.LinksPerObject,
                LinksForEveryRow: some.LinksForEveryRow,
                ButtonsForEveryRow: some.ButtonsForEveryRow,
                fieldsToAdd: some.fieldsToAdd
            }}
            />

        }
        else
            return <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
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

export default SubProperties;
//export const fieldsArray = this.state.fieldsArray;
