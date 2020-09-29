import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import Form from '../General/Form';

/*
create table Tasks--משימות
(
TaskID int not null identity,
TaskTypeId int not null,
"Description" nvarchar(max),
PropertyID int,
SubPropertyID int, --constraint DF_Tasks_SubPropertyID default 0,
ClassificationID int,
ClientClassificationID int,
ReportDate datetime,--תאריך פניה
DateForHandling datetime not null,--תאריך לטיפול
IsHandled bit constraint DF_Tasks_IsHandled default 0, --האם טופל
HandlingDate datetime,--תאריך טיפול
HandlingWay nvarchar(max),--אופן טיפול

 */
export class Tasks extends Component {
    submit = (type, object) => {
        let x = false;
        if (type === 'Add')
            x = this.addObject(object)
        else if (type === 'Update')
            x = this.updateObject(object)
        else
            x = this.Search(object)
        if (x)
            return <Redirect to='/Tasks' />
        return null;
    }
    Search = (object) => {
        Axios.post('Task/Search', { ...object }).then(x => { alert("הנכס נשמר בהצלחה" + x) }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        Axios.post('Task/UpdateTask', object).then(x => { alert('המטלה עודכנה בהצלחה') }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        object.TaskID = 1;
        /* fetch('https://localhost:44368/api/Task/AddTask', {
 
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
             },
             method: "Post",
             body: JSON.stringify({ dt: object })
         })
 
             .catch(err => console.log('err', err))
             // .then(res => res.json())
             .then(x => { console.log('המטלה נוספה בהצלחה', x) });
             */
        Axios.post('Task/AddTask', object, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        })
            .then(x => { alert('המטלה נוספה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    AddReport = (object) => {
        Axios.post('Task/AddTask', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
            .then(ress => { alert('המטלה נוספה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = (object) => {
        Axios.post('Task/DeleteTask', object, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).then(x => { alert('המטלה נמחקה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    ClassificationOptions = Axios.get('Task/GetAllClassificationTypes').then(res => res.data.map(item => { return { id: item.ClassificationID, name: item.ClassificationName } }))
    TaskTypeOptions = Axios.get('Task/GetAllTaskTypes').then(res => res.data.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } }))
    state = {
        name: 'משימות',

        fieldsArray: [{ field: 'TaskID', name: 'קוד משימה', type: 'text' }, { field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: this.TaskTypeOptions }, { field: 'Description', name: 'תיאור', type: 'text' },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: this.ClassificationOptions }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }, { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],
        ObjectsArray:/*Axios.get('Task/GetAllTasks') */[{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }],//
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
                fieldsArray: this.state.fieldsArray, Object: {}, erors: [], submit: this.submit, type: 'Add', name: ' הוספת משימה',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: []
            }}> </Link>],
            ButtonsForTable: []
        }
    }

    set = (object) => {
        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]
        let fieldsToAdd = [];
        let tempobject = object;
        let LinksPerObject = [];


        let typeObj = this.TaskTypeOptions.then(res => res.find(obj => obj.Id === object.TaskTypeId))
        object.TaskTypeId = typeObj.Name
        let classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClassificationID))
        object.ClassificationID = classifObj.Name;
        classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClientClassificationID))
        object.ClientClassificationID = classifObj.Name;
        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link to={{
                pathname: '/SubProperties',
                object: Axios.post('SubProperty/GetSubPropertyByID', object.SubPropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data),
                type: 'details'
            }} >נכס מחולק</Link>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים

        if (object.TaskTypeId === 'תקלה')//בדיקה האם מדובר בדווח תקלה
            fieldsToAdd.push({ field: 'ClientClassificationID', name: 'סווג לקוח', type: 'text', index: 3 },//פונקציה שמחזירה שם סווג
                { field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 3 })

        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 6 },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'text', index: 6 })

        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, object: tempobject,
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
        else if (this.props.location.type === 'report') {

            return <Form location={{
                Object: {},
                name: 'שלח',
                type: 'Report',
                fieldsArray: [{ field: 'Description', name: 'תיאור הבעיה', type: 'textarea' },
                { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.ClassificationOptions }],
                submit: this.submit,
                LinksPerObject: [], LinksForEveryRow: [], ButtonsForEveryRow: [], fieldsToAdd: [],
            }} />
        }
        else
            return <Table name={this.state.name}
                fieldsArray={this.state.fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set}
                delObject={this.deleteObject}
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

export default Tasks
