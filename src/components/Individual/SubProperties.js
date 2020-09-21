import React, { Component } from 'react'
import Table from "../General/Table";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Axios from "../Axios";
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
    submit = (type) => {
        if (type === 'הוסף')
            this.addObject()
        else
            this.updateObject()
    }
    updateObject = (object) => {
        Axios.post('SubProperty/UpdateSubProperty', object).then(x => { alert("הדירה נשמרה בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
    }
    addObject = (object) => {
        object.subPropertyID = 1;
        Axios.post('SubProperty/AddSubProperty', object).then(x => { alert('הדירה עודכנה בהצלחה') });
    }
    deleteObject = () => {
        window.confirm("האוביקט ימחק מיד");
    }
    state = {
        name: 'תת נכסים',
        fieldsPropertyArray: [{ field: 'SubPropertyID', name: 'קוד דירה', type: 'text' }, { field: 'PropertyID', name: 'בעלים', type: 'text' },
        { field: 'num', name: 'עיר', type: 'text' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsRented', name: 'רחוב', type: 'text' }],
        PropertiesArray: [{ SubPropertyID: 1, PropertyID: 3, num: 2, Size: 150, RoomsNum: 2, IsRented: false }],//
        LinksForEveryRow: [{ name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ name: ' הוספת דירה', link: '/Form' }],
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
        if (object.IsRented)
            tempobject.IsRented = <Link to='/Details'>v</Link>//שולח פרטי השכרה שמתקבלים מהפונקציה
        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow,
            object: tempobject, LinksPerObject: []
        };
    }
    render() {
        return (
            <div>
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    LinksForTable={this.state.LinksForTable}
                    ButtonsForTable={this.state.ButtonsForTable}
                    set={this.set} delObject={this.deleteObject}
                    validate={this.validate} erors={this.state.erors} submit={this.submit} />
            </div>
        )
    }

}

export default SubProperties;
//export const fieldsArray = this.state.fieldsArray;
