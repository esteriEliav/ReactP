import React, { Component } from 'react'
import Table from '../General/Table'
import Properties, { propertiesList } from './Properties'
import { SubProperties, SubPropertiesList } from './SubProperties'

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
    ClassificationOptions =  GetFunction('Task/GetAllClassificationTypes').map(item => { return { id: item.ClassificationID, name: item.ClassificationName } })
    cities = GetFunction('Property/GetAllCities')
    propertiesOptions = propertiesList.map(item => { const street = postFunction('Property/GetStreetByID', item.CityID); return { id: item.PropertyID, name: item.PropertyID + ':' + street.streetName + ' ' + item.Number + ' ' + this.cities.find(city => city.CityID === item.CityID).cityName } })
    TaskTypeOptions =[] //GetFunction('Task/GetAllTaskTypes').map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } })
    state = {

        name: 'משימות',

        fieldsArray: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: this.TaskTypeOptions}, { field: 'Description', name: 'תיאור', type: 'texterea', required: true },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: this.ClassificationOptions  }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true },
        { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        ObjectsArray: //this.props.location && this.props.location.objects ? this.props.location.objects :/* tasksLists*/
        [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }],//

        fieldsToSearch: [{ field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: this.TaskTypeOptions },
        { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: this.ClassificationOptions }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' },
        { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],
        isAutho: false,
        showForm: this.props.type === 'report' || this.props.type === 'form' ? true : false,
        showDetails: this.props.type === 'details' ? true : false,
        showSomthing: null

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
    submit = (type, object) => {
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
        const bool = (type, object, this.state.ObjectsArray, '/Tasks', path)
        if (bool)

            this.closeFormModal();
    }


    setForTable = () => {
        let LinksForTable = [];

        if (this.state.name !== 'משימות') {
            LinksForTable = [<button onClick={() => { this.setState({ ObjectsArray: tasksLists, name: 'משימות' }) }}>חזרה למשימות</button>]

        }
        else
            LinksForTable = [<button onClick={() => {
                this.setState({
                    showForm: true, showSomthing:
                        <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                            fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוסף'
                            setForForm={this.setForForm}
                            validate={this.validate} />
                })
            }} > הוספת משימה</button>,
            <button onClick={() => { this.setState({ objectsArray: GetFunction('Task/GetAllarchivesTasks'), name: 'ארכיון המשימות' }) }}>לארכיון המשימות</button>]


        return { LinksForTable }
    }
    setForForm = object => {
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'נכס', type: 'select', index: 1, selectOptions: this.propertiesOptions },
                { field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })/*{ field: 'PropertyID', name: 'סווג לקוח', type: 'r', index: 1,selectOptions:this.propertiesOptions }*/
            const property = propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property[0] && property[0].IsDivided) {
                const SubProperties = SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', type: 'select', index: 1,selectOptions:subPropertiesOptions });
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


        const docks = postFunction('User/GetUserDocuments', { id: object.TaskID, type: 6 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)

        let LinksForEveryRow = []
        let ButtonsForEveryRow = []

        let tempobject = object;
        let LinksPerObject = [];
        const propertyObject = postFunction('Property/GetPropertyByID', object.PropertyID);

    //      let typeObj = this.TaskTypeOptions.find(obj => obj.Id === object.TaskTypeId)
    //     object.TaskTypeId = typeObj.Name
    //     let classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClassificationID))
    //     object.ClassificationID = classifObj.Name;
    //    classifObj = this.ClassificationOptions.then(res => res.find(obj => obj.ID === object.ClientClassificationID))
    //        object.ClientClassificationID = classifObj.Name;
        let fieldsToAdd = this.setForForm(object).fieldsToAdd;
        console.log('fieldsToAdd.length - 1', fieldsToAdd.length - 1);
        console.log('fieldsToAdd.', fieldsToAdd);
        console.log('fieldsToAdd[]', fieldsToAdd[fieldsToAdd.length - 1]);
        fieldsToAdd[fieldsToAdd.length - 1].name = 'מסמכים'
        if (object.TaskTypeId === 1 || object.TaskTypeId === 4) {

            object.PropertyID = <Link onClick={() => {
                this.setState({
                    showDetails: true, showSomthing: <Properties object={propertyObject} type='details'
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
                })
            }}>{object.PropertyID}</Link>


            if (object.SubPropertyID !== null)
                LinksPerObject.push(<button onClick={() => {
                    this.setState({
                        showDetails: true, showSomthing:
                            <SubProperties object={postFunction('SubProperty/GetSubPropertyByID', object.SubPropertyID)}
                                type='details' isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
                    })
                }}>פרטי נכס מחולק</button>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים
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
                { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.ClassificationOptions  }
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

            return <div><Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                Object={this.props.object}
                name={this.props.formName}
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
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
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
export const tasksLists = []// GetFunction('Task/GetAllTasks');