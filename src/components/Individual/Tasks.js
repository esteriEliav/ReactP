import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";

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
        Axios.post('Task/Search', { ...object }).then(x => { alert("הנכס נשמר בהצלחה" + x) });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    updateObject = (object) => {
        debugger
        Axios.post('Task/UpdateTask', object).then(x => { alert('המטלה עודכנה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    addObject = (object) => {
        //debugger
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
        Axios.post('Task/GetAllTasks', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        })
            .then(x => { alert('המטלה נוספה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    deleteObject = (object) => {
        Axios.post('Task/DeleteTask', object).then(x => { alert('המטלה נמחקה בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    state = {
        name: 'משימות',
        fieldsTasksArray: [{ field: 'TaskID', name: 'קוד משימה', type: 'text' }, { field: 'TaskTypeId', name: 'סוג', type: 'text' }, { field: 'Description', name: 'תיאור', type: 'text' },
        { field: 'ClassificationID', name: 'סווג', type: 'radio' }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }, { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],
        TasksArray: [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }],//
        LinksForEveryRow: [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }],
        LinksForTable: [{ type: 'Add', name: ' הוספת משימה', link: '/Form' }],
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


    set = (object) => {
        let LinksForEveryRow = [...this.state.LinksForEveryRow];
        let fieldsToAdd = [];
        let tempobject = object;
        let LinksPerObject = [];
        //let ButtonsForEveryRow=[this.state.ButtonsForEveryRow];
        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link to='/' >נכס מחולק</Link>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים
        //LinksForEveryRow.push({ name: 'נכס מחולק', link: '/Table', index: 'end' })//קישור לתת הדירה ולדירה השלמה
        if (true)//בדיקה האם הדירה מושכרת
            LinksPerObject.push(<Link to='/' >פרטי השכרת נכס</Link>)//קישור לקומפוננטת השכרות והאוביקט הוא מה שיתקבל מהפונקציה של פרטי השכרה לנכס מסוים
        //LinksForEveryRow.push({ name: 'לפרטי השכרת נכס', link: '/Details', index: 'end' })
        if (true)//בדיקה האם מדובר בדווח תקלה
            fieldsToAdd.push({ field: 'ClientClassificationID', name: 'סווג לקוח', type: 'text', index: 3 },//פונקציה שמחזירה שם סווג
                { field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 3 })
        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 6 },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'text', index: 6 })
        return {
            fieldsToAdd: fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, object: tempobject,
            LinksPerObject: LinksPerObject
        };
    }
    render() {

        return (
            <div>

                <Table name={this.state.name} fieldsArray={this.state.fieldsTasksArray} objectsArray={this.state.TasksArray}
                    LinksForTable={this.state.LinksForTable}
                    ButtonsForTable={this.state.ButtonsForTable} fieldsToAdd={this.state.fieldsToAdd}
                    set={this.set} delObject={this.deleteObject}
                    validate={this.validate} erors={this.state.erors} submit={this.submit}
                    fieldsToSearch={this.state.fieldsTasksArray.filter((f, index) => index !== 0)} />

            </div>
        )

    }
}

export default Tasks
