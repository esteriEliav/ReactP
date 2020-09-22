import React, { Component } from 'react'
import Table from '../General/Table'
import { Link } from 'react-router-dom';
import Axios from '../Axios'


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
export class Main extends Component {

    submit = (type, object) => {
        if (type === 'Add')
            this.addObject(object)
        else
            this.updateObject(object)
    }
    updateObject = (object) => {
        Axios.post('Property/UpdateProperty', object).then(x => { alert("הנכס נשמר בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
    }
    addObject = (object) => {
        object.PropertyID = 1;
        Axios.post('Property/AddProperty', object).then(x => { alert('הנכס עודכן בהצלחה') });

    }
    deleteObject = (object) => {
        Axios.post('Property/DeleteProperty', object).then(x => { alert("הנכס נשמר בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
    }
    state = {
        name: 'דירות',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text' }, { field: 'OwnerID', name: 'בעלים', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' },
        { field: 'StreetName', name: 'רחוב', type: 'text' }, { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsRented', name: 'מושכר', type: 'checkbox' }, { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' }],


        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'checkbox' }],
        PropertiesArray: [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        { PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: false, IsRented: false, IsExclusivity: false }],//
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
    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
    // setForAddCommonLinks = (LinksForEveryRow, LinksForTable, ButtonsForEveryRow) =>
    //  this.setState({ LinksForEveryRow: LinksForEveryRow, LinksForTable: LinksForTable, ButtonsForEveryRow: ButtonsForEveryRow })
    set = (object) => {
        const { } = this.state;
        let LinksForEveryRow = [...this.state.LinksForEveryRow];
        let fieldsToAdd = [];
        let tempobject = object;
        //let ButtonsForEveryRow=[this.state.ButtonsForEveryRow];
        if (object.IsDivided)
            tempobject.IsDivided = <Link to='/Details'  >V</Link>//ששולח פרטי נכסי בן של הדירה
        // LinksForEveryRow.push({ name: 'לדירות המחולקות', link: '', index: 6 })
        if (object.IsRented)
            tempobject.IsRented = <Link to='/Details'>V</Link>//ושולח פרטי השכרה שמתקבלים מהפונקציה
        //LinksForEveryRow.push({ name: 'לפרטי השכרה', link: '', index: 9 })
        if (object.IsExclusivity)
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'text', index: 10 })
        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, object: tempobject
            , LinksPerObject: []
        };

    }
    render() {


        return (
            <div>
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    LinksForTable={this.state.LinksForTable} ButtonsForTable={this.state.ButtonsForTable}
                    set={this.set} delObject={this.deleteObject}
                    validate={this.validate} erors={this.state.erors} submit={this.submit}
                    fieldsToSearch={this.state.fieldsToSearch} />
            </div>
        )
    }
}

export default Main
