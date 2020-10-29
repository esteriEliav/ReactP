import React, { Component } from 'react'
import Table from '../General/Table'
import Properties from './Properties'
import { SubProperties } from './SubProperties'

import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import Form from '../General/Form';
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
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
    state = {

        name: 'משימות',

        fieldsArray: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: [] }, { field: 'Description', name: 'תיאור', type: 'texterea', required: true },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: [] }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true },
        { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.tasksList,
        // [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        // { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '2/08/2018', IsHandled: true }],//

        fieldsToSearch: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: [] }, { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: [] },
        { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }, { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        isAutho: false,
        showForm: this.props.type === 'report' || this.props.type === 'form' ? true : false,
        showDetails: this.props.type === 'details' ? true : false,
        showSomthing: null,
        ClassificationOptions: [],
        TaskTypeOptions: [],
        propertiesOptions: [],
        docks: [],
        propertyObject: {},
        spobject: {}

    }
    componentDidMount = async () => {
        const x = await GetFunction('Task/GetAllClassificationTypes');
        const ClassificationOptions = x !== null ?
            x.map(item => { return { id: item.ClassificationID, name: item.ClassificationName } }) : []

        const y = await GetFunction('Task/GetAllTaskTypes');
        const TaskTypeOptions = y !== null ?
            y.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } }) : []
        const cities = this.props.cities
        const propertiesOptions = this.props.propertiesList.map(async item => {
            const street = await postFunction('Property/GetStreetByID', item.CityID);
            if (street !== null)
                return { id: item.PropertyID, name: item.PropertyID + ':' + street.streetName + ' ' + item.Number + ' ' + cities.find(city => city.CityID === item.CityID).cityName }
        })
        let fieldsArray = [...this.state.fieldsArray];
        let fieldsToSearch = [...this.state.fieldsToSearch];
        fieldsArray[0].radioOptions = TaskTypeOptions;
        fieldsToSearch[0].radioOptions = TaskTypeOptions;

        fieldsArray[2].radioOptions = ClassificationOptions;
        fieldsToSearch[2].radioOptions = ClassificationOptions;
        this.setState({ fieldsArray, fieldsToSearch, ClassificationOptions, TaskTypeOptions, propertiesOptions })
    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
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
    submitSearch = (object) => {
        const path = 'Task/Search';

        if (object) {
            let objects = Search(object, path)
            let name = 'תוצאות חיפוש'
            if (objects === null || objects === []) {
                objects = []
                name = 'לא נמצאו תוצאות'
            }
            this.setState({ objectsArray: objects, name })
        }
    }
    submit = async (type, object) => {
        ;
        let path = 'Task/' + type + 'Task';
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
            if (object.ReportDate && object.ReportDate !== '')
                newObj.ReportDate = object.ReportDate
            newObj.DateForHandling = object.DateForHandling
            newObj.IsHandled = object.IsHandled
            if (object.HandlingDate && object.HandlingDate !== '')
                newObj.HandlingDate = object.HandlingDate
            if (object.HandlingWay && object.HandlingWay !== '')
                newObj.HandlingWay = object.HandlingWay
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }
            object = newObj

        }
        else if (type === 'Delete') {
            object = { id: object.TaskID }
        }
        const res = await CommonFunctions(type, object, path)
        if (res && res !== null) {
            this.closeFormModal();
        }
    }


    setForTable = () => {
        let LinksForTable = [];

        if (this.state.name !== 'משימות') {
            LinksForTable = [<button type='button' onClick={() => { this.setState({ ObjectsArray: this.props.tasksList, name: 'משימות' }) }}>חזרה למשימות</button>]

        }
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                            fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוסף'
                            setForForm={this.setForForm}
                            validate={this.validate} />
                })
            }} > הוספת משימה</button>,
            <button type='button' onClick={() => { GetFunction('Task/GetAllarchivesTasks').then(res => this.setState({ objectsArray: res })); this.setState({ name: 'ארכיון המשימות' }); }}>לארכיון המשימות</button>]


        return { LinksForTable }
    }
    setForForm = object => {
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'נכס', type: 'select', index: 1, selectOptions: this.state.propertiesOptions })
            if (object.TaskTypeId === 1)
                fieldsToAdd.push({ field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })/*{ field: 'PropertyID', name: 'סווג לקוח', type: 'r', index: 1,selectOptions:this.state.propertiesOptions }*/
            const property = this.props.propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property[0] && property[0].IsDivided) {
                const SubProperties = this.props.SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', type: 'select', index: 1, selectOptions: subPropertiesOptions });
            }

        }
        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 4 },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'texterea', index: 4 })
        fieldsToAdd.push({ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' })
        console.log('fields', fieldsToAdd)
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject };

    }
    set = (object) => {


        let LinksForEveryRow = []
        let ButtonsForEveryRow = []

        let tempobject = object;
        let LinksPerObject = [];
        postFunction('Property/GetPropertyByID', { id: object.PropertyID }).then(res => this.setState({ propertyObject: res }))

        let typeObj = this.state.TaskTypeOptions.length > 0 ?
            this.state.TaskTypeOptions.find(obj => obj.Id === object.TaskTypeId) : {}
        object.TaskTypeId = typeObj.Name

        let classifObj = this.state.ClassificationOptions.length > 0 ?
            this.state.ClassificationOptions.find(obj => obj.ID === object.ClassificationID) : {}
        object.ClassificationID = classifObj.Name;

        classifObj = this.state.ClassificationOptions.length > 0 ?
            this.state.ClassificationOptions.find(obj => obj.ID === object.ClientClassificationID) : {}
        object.ClientClassificationID = classifObj.Name;

        let fieldsToAdd = this.setForForm(object).fieldsToAdd;
        fieldsToAdd.pop();

        object.DateForHandling = new Date(object.DateForHandling).toLocaleDateString();

        if (object.TaskTypeId === 1 || object.TaskTypeId === 4) {
            if (object.TaskTypeId === 1)
                object.ReportDate = new Date(object.ReportDate).toLocaleDateString();
            object.PropertyID = <Link onClick={() => {
                this.setState({ showDetails: true })
                this.setState({
                    showSomthing: <Properties object={this.state.propertyObject} type='details'
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
                })
            }}>{object.PropertyID}</Link>


            if (object.SubPropertyID !== null) {
                postFunction('SubProperty/GetSubPropertyByID', { id: object.SubPropertyID }).then(res => this.setState({ spobjectres: res }))
                LinksPerObject.push(<button type='button' onClick={() => {
                    this.setState({
                        showDetails: true, showSomthing:
                            <SubProperties object={this.state.spobject}
                                type='details' isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
                    })
                }}>פרטי נכס מחולק</button>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים
            }
        }
        if (object.IsHandled)
            object.HandlingDate = new Date(object.HandlingDate).toLocaleDateString();
        postFunction('User/GetUserDocuments', { id: object.TaskID, type: 6 }).then(res => this.setState({ docks: res }))
        if (this.state.docks && this.state.docks[0]) {
            fieldsToAdd.push({ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' })
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        }
        return {
            fieldsToAdd, LinksForEveryRow, enable: true,
            ButtonsForEveryRow, object: tempobject, LinksPerObject
        };

    }
    rend = () => {
        if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2 && this.props.user.RoleID !== 3) {
            return <Redirect to='/a' />
        }

        if (this.props.type === 'report') {

            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={{ PropertyID: this.props.object.PropertyID, SubPropertyID: this.props.object.SubPropertyID }}
                name='שלח'
                type='Report'
                fieldsArray={[{ field: 'Description', name: 'תיאור הבעיה', type: 'texterea' },
                { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.state.ClassificationOptions }
                ]}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.props.validate}
            />
        }
        else if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) {
            return <Redirect to='/a' />
        }

        else if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }

        else if (this.props.type === 'form') {

            return <div><Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name='הוסף'
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate} />{this.state.showSomthing}</div>
        }
        else {

            return <div><Table name={this.state.name}
                fieldsArray={this.state.fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set} setForForm={this.setForForm}
                delObject={this.submit}
                validate={this.validate} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />{this.state.showSomthing}</div>
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
//export const tasksLists = [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
//{ TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }];//
// GetFunction('Task/GetAllTasks');