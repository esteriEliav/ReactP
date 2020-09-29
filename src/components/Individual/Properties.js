import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from '../Axios'
import Details from '../General/Details';
import { ownersList } from './PropertyOwner'



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

    submit = (type, object) => {
        let x = false;
        if (type === 'Add')
            x = this.addObject(object)
        else if (type === 'Update')
            x = this.updateObject(object)
        else
            x = this.Search(object)
        if (x)
            return <Redirect to='/Properties' />
        return null;
    }
    addObject = (object) => {
        object.PropertyID = 1;
        //object.CityID=
        //object.StreetID=

        Axios.post('Property/AddProperty', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
            .then(
                x => console.log('הנכס עודכן בהצלחה') + x
            );


        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    Search = (object) => {
        //{ ...object }
        Axios.post('Property/Search', [object.CityName, object.StreetName, object.Number, object.Floor, object.IsRented],
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
            .then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        //object.CityID=
        //object.StreetID=
        Axios.post('Property/UpdateProperty', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
            .then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }

    deleteObject = (object) => {
        Axios.post('Property/DeleteProperty', object).then(x => { alert("הנכס נשמר בהצלחה" + x) }, alert("תקלה: האוביקט לא נשמר"));
    }
    owners = ownersList.map(item => { return { id: item.OwnerID, name: item.OwnerFirstName + ' ' + item.OwnerLastName } })//.then(res => res.
    state = {
        name: 'דירות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text' }, { field: 'OwnerID', name: 'בעלים', type: 'select', selectOptions: this.owners }, { field: 'CityName', name: 'עיר', type: 'text' },
        { field: 'StreetName', name: 'רחוב', type: 'text' }, { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsRented', name: 'מושכר', type: 'checkbox' }, { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' }],


        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'checkbox' }],

        ObjectsArray: /*Axios.post('Property/GetAllProperties').then(res => res.data)*/[{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        { PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: false, IsRented: false, IsExclusivity: false }],//
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
    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, erors: [], submit: this.submit, type: 'Add', name: ' הוספת דירה',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: []
            }}> </Link>],

            ButtonsForTable: [],

        }
    }
    set = (object) => {    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]
        let tempobject = { ...object };
        let fieldsToAdd = []
        const ownerobject = {}// Axios.post('PropertyOwner/GetOwnerByID', object.OwerID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        // .then(res => res.data)
        tempobject.OwnerID = <Link to={{
            pathname: '/PropertyOwner',
            Object: ownerobject,
            type: 'details'
        }}>
            {ownerobject.firstName + ' ' + ownerobject.lastName}</Link>

        if (object.IsDivided)
            tempobject.IsDivided = <Link to={{
                pathname: '/SubProperties',
                objects: Axios.post('SubProperty/GetSubPropertiesOfParentProperty', object.PropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }),
                type: 'table'
            }} >V</Link>//ששולח פרטי נכסי בן של הדירה
        else
            tempobject.IsDivided = 'X'

        const rentalObject = Axios.post('Property/GetRentalByPropertyID', object.propertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
            .then(res => res.data)
        if (object.IsRented)
            tempobject.IsRented = <Link to={{
                pathname: '/Rentals',
                objects: rentalObject,
                type: 'table'
            }}>V</Link>//ושולח פרטי השכרה שמתקבלים מהפונקציה
        else
            tempobject.IsDivided = 'X'

        if (object.IsExclusivity)
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'text', index: 10 })
        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, object: tempobject
            , LinksPerObject: []
        };

    }
    setForForm = (object) => {

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
                setForTable={this.setForTable}
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

export default Properties
