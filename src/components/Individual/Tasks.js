import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import Form from '../General/Form';
import { CommonFunctions } from '../General/CommonFunctions';
import TaskObject from '../../Models-Object/TaskObject'

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
    ClassificationOptions = Axios.get('Task/GetAllClassificationTypes').then(res => res.data.map(item => { return { id: item.ClassificationID, name: item.ClassificationName } }))
    TaskTypeOptions = []//Axios.get('Task/GetAllTaskTypes').then(res => res.data.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } }))
    state = {
        name: 'משימות',

        fieldsArray: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio',/* radioOptions: this.TaskTypeOptions*/ }, { field: 'Description', name: 'תיאור', type: 'text', required: true },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', /*radioOptions: this.ClassificationOptions */ }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true }, { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        ObjectsArray:/*Axios.get('Task/GetAllTasks') */[{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }],//

        fieldsToSearch: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio',/* radioOptions: this.TaskTypeOptions*/ },
        { field: 'ClassificationID', name: 'סווג', type: 'radio',/* radioOptions: this.ClassificationOptions*/ }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' },
        { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

    }

    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.ReportDate && object.ReportDate > object.DateForHandling) {

            erors.RoomsNum = 'תאריך דווח מאוחר יותר מתאריך לטיפול'
            isErr = true
        }
        if (object.ReportDate && object.HandlingDate && object.ReportDate > object.HandlingDate) {

            erors.RoomsNum = 'תאריך דווח מאוחר יותר מתאריך טיפול'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submit = (type, object) => {
        let path = 'Task/' + type
        path += type !== 'Search' ? 'Task' : ''
        if (type === 'Add' || type === 'Update') {
            let newObj = TaskObject();
            if (type === 'Add')
                newObj.TaskID = 1
            else
                newObj.TaskID = object.TaskID;
            newObj.TaskTypeId = object.TaskTypeId
            newObj.Description = object.Description
            newObj.PropertyID = object.PropertyID
            newObj.SubPropertyID = object.SubPropertyID
            newObj.ClassificationID = object.ClassificationID
            newObj.ClientClassificationID = object.ClientClassificationID
            if (object.ReportDate !== '')
                newObj.ReportDate = object.ReportDate
            newObj.DateForHandling = object.DateForHandling
            newObj.IsHandled = object.IsHandled
            if (object.HandlingDate !== '')
                newObj.HandlingDate = object.HandlingDate
            if (object.HandlingWay !== '')
                newObj.HandlingWay = object.HandlingWay


            object = newObj

        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/Tasks', path)
    }


    setForTable = () => {
        return {
            LinksForTable: [<Link to={{
                pathname: '/Form',
                fieldsArray: this.state.fieldsArray, Object: {}, erors: [], submit: this.submit, type: 'Add', name: ' הוספת משימה',
                LinksForEveryRow: [], ButtonsForEveryRow: [],
                fieldsToAdd: [], setForForm: this.setForForm
            }}> הוספת משימה</Link>],
            ButtonsForTable: []
        }
    }
    setForForm = object => {
        let fieldsToAdd = [];
        // if (this.TaskTypeOptions.find(type => type.id === object.TaskTypeId).name === 'תקלה')
        //     fieldsToAdd.push({ field: 'ClientClassificationID', name: 'סווג לקוח', type: 'text', index: 3 },//פונקציה שמחזירה שם סווג
        //         { field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 3 })

        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 6 },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'text', index: 6 })
        return fieldsToAdd;

    }
    set = (object) => {


        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.deleteObject, index: 'end' }]

        let tempobject = object;
        let LinksPerObject = [];


        //    // let typeObj = this.TaskTypeOptions.find(obj => obj.Id === object.TaskTypeId)
        //     //object.TaskTypeId = typeObj.Name
        //    // let classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClassificationID))
        //    // object.ClassificationID = classifObj.Name;
        //     classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClientClassificationID))
        //     object.ClientClassificationID = classifObj.Name;
        if (object.SubPropertyID !== null)
            LinksPerObject.push(<Link to={{
                pathname: '/SubProperties',
                object: Axios.post('SubProperty/GetSubPropertyByID', object.SubPropertyID, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => res.data),
                type: 'details'
            }} >נכס מחולק</Link>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים


        return {
            fieldsToAdd: this.setForForm(object), LinksForEveryRow: LinksForEveryRow,
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
                Object: { PropertyID: this.props.location.PropertyID, SubPropertyID: this.props.location.SubPropertyID },
                name: 'שלח',
                type: 'Report',
                fieldsArray: [{ field: 'Description', name: 'תיאור הבעיה', type: 'texterea' },
                    // { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.ClassificationOptions }
                ],
                submit: this.submit, setForForm: () => [],
                LinksPerObject: [], LinksForEveryRow: [], ButtonsForEveryRow: [], fieldsToAdd: [], validate: this.props.location.validate
            }} />
        }
        else
            return <Table name={this.state.name}
                fieldsArray={this.state.fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set} setForForm={this.setForForm}
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
