import React, { Component } from 'react'
import Table from '../General/Table'
import { propertiesList } from './Properties'
import { SubPropertiesList } from './SubProperties'

import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import Form from '../General/Form';
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import TaskObject from '../../Models-Object/TaskObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'

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
    ClassificationOptions = GetFunction('Task/GetAllClassificationTypes').map(item => { return { id: item.ClassificationID, name: item.ClassificationName } })
    propertiesOptions = propertiesList.map(item => { return { id: item.PropertyID, name: item.PropertyID + ':' + item.StreetID + ' ' + item.Number + ' ' + item.CityID } })
    TaskTypeOptions = []//GetFunction('Task/GetAllTaskTypes').map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } })
    state = {
        name: 'משימות',

        fieldsArray: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio',/* radioOptions: this.TaskTypeOptions*/ }, { field: 'Description', name: 'תיאור', type: 'text', required: true },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', /*radioOptions: this.ClassificationOptions */ }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true }, { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        ObjectsArray:/* tasksLists*/[{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }],//

        fieldsToSearch: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio',/* radioOptions: this.TaskTypeOptions*/ },
        { field: 'ClassificationID', name: 'סווג', type: 'radio',/* radioOptions: this.ClassificationOptions*/ }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' },
        { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],
        isAutho: false,
        showForm: this.props.location.type === 'report' || this.props.location.type === 'form' ? true : false,
        showDetails: this.props.location.type === 'details' ? true : false,

    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false })
    }
    closeFormModal = () => {

        this.setState({ showForm: false })
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
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }
            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.TaskID)
            object = id
        }
        if (type === 'Update' && object.IsHandled === true) {
            const ret = CommonFunctions(type, object, this.state.ObjectsArray, '/Tasks', path)
            CommonFunctions('Delete', object, this.state.ObjectsArray, '/Tasks', '/Tasks/DeleteTask')
            return ret;
        }
        return CommonFunctions(type, object, this.state.ObjectsArray, '/Tasks', path)
    }


    setForTable = () => {
        return {
            LinksForTable: [<button onClick={() => { this.setState({ showForm: true }) }} showForm={() => {

                return this.state.showForm && <Form closeModal={this.closeFormModal} isOpen={this.state.showForm} fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                    LinksForEveryRow={[]} ButtonsForEveryRow={[]}
                    fieldsToAdd={[]} setForForm={this.setForForm}
                    validate={this.validate} />
            }}> הוספת משימה</button>],
            ButtonsForTable: []
        }
    }
    setForForm = object => {
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'סווג לקוח', type: 'select', index: 1,/*selectOptions:this.propertiesOptions*/ });
            const property = propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property[0] && property[0].IsDivided) {
                const SubProperties = SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', type: 'select', index: 1,/*selectOptions:subPropertiesOptions*/ });
            }
        }

        if (object.TaskTypeId === 1) {
            fieldsToAdd.push(/*{ field: 'ClientClassificationID', name: 'סווג לקוח', type: 'radio', index: 2,radioOptions: this.ClassificationOptions  },*///פונקציה שמחזירה שם סווג
                { field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })

        }

        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 4 },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'texterea', index: 4 })
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject };

    }
    set = (object) => {


        const docks = postFunction('User/GetUserDocuments', { id: object.TaskID, type: 6 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)

        let LinksForEveryRow = [{ type: 'Update', name: 'עריכה', link: '/Form', index: 'end' }]
        let ButtonsForEveryRow = [{ name: 'מחיקה', type: 'Delete', onclick: this.submit, index: 'end' }]

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
                object: postFunction('SubProperty/GetSubPropertyByID', object.SubPropertyID),
                type: 'details'
            }} >נכס מחולק</Link>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים


        return {
            fieldsToAdd: this.setForForm(object).fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, object: tempobject,
            LinksPerObject: LinksPerObject
        };
    }
    rend = () => {
        if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2 && this.props.user.RoleID !== 3) {
            return <Redirect to='/a' />
        }

        if (this.props.location.type === 'report') {

            return <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                Object={{ PropertyID: this.props.location.PropertyID, SubPropertyID: this.props.location.SubPropertyID }}
                name='שלח'
                type='Report'
                fieldsArray={[{ field: 'Description', name: 'תיאור הבעיה', type: 'texterea' },
                    // { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.ClassificationOptions }
                ]}
                submit={this.submit} setForForm={this.setForForm}
                LinksPerObject={[]} LinksForEveryRow={[]} ButtonsForEveryRow={[]} fieldsToAdd={[]} validate={this.props.location.validate}
            />
        }
        else if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) {
            return <Redirect to='/a' />
        }

        else if (this.props.location.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.closeDetailsModal} isOpen={this.state.showDetails}
                object={this.props.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }

        else if (this.props.location.type === 'form') {

            return <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                Object={this.props.location.object}
                name={this.props.location.formName}
                type={this.props.location.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                LinksPerObject={[this.linkToAddPropertyOwner]} LinksForEveryRow={[]}
                ButtonsForEveryRow={[]} fieldsToAdd={[]} validate={this.props.location.validate} />
        }
        else {

            return <Table name={this.state.name}
                fieldsArray={this.state.fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set} setForForm={this.setForForm}
                delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit}
                fieldsToSearch={this.state.fieldsToSearch} />
        }
    }
    render() {

        return (
            <div>
                {this.rend()}
            </div>
        )

    }
}

export default connect(mapStateToProps)(Tasks)
export const tasksLists = [];/* GetFunction('Task/GetAllTasks');*/