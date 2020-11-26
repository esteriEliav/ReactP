import React, { Component } from 'react'
import Table from '../../General/Table/Table'
import Properties from '../Properties/Properties'
import SubProperties from '../SubProperties'
import PopUpForProperties from '../PopUpForProperty/PopUpForProperties'

import { Link, Redirect, withRouter } from 'react-router-dom';
import Axios from "../../Axios";
import Details from '../../General/Details/Details';
import Form from '../../General/Form/Form';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import TaskObject from '../../../Models-Object/TaskObject'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Task.css';
import RedirectTo from "../../RedirectTo";
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'
import fileDownload from 'js-file-download'
import { Renter } from '../Renter/Renter'

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

        fieldsArray: [
            { field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: [], required: true }, { field: 'Description', name: 'תיאור', type: 'texterea', required: true },
            { field: 'ClassificationID', name: 'סיווג', type: 'radio', radioOptions: [] }, { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true },
            { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],

        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.tasksList,
        // [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
        // { TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '2/08/2018', IsHandled: true }],//

        fieldsToSearch: [{ field: 'ClassificationID', name: 'סיווג', type: 'radio', radioOptions: [] },
        { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }],

        isAutho: false,
        showForm: false,
        showDetails: false,
        showEx: false,
        showSomthing: null,
        showExtention: null,
        ClassificationOptions: [],
        TaskTypeOptions: [],
        propertiesOptions: [],
        docks: [],
        propertyObject: {},
        spobject: {},
        red: null,
        type: this.props.location.type ? this.props.location.type : this.props.type,
        prevName: null,
        prevObjects: []

    }
    componentWillMount = () => {

        const x = this.props.classificationTypes;
        const ClassificationOptions = x !== null ?
            x.map(item => { return { id: item.ClassificationID, name: item.ClassificationName } }) : []

        const y = this.props.taskTypes;
        const TaskTypeOptions = y !== null ?
            y.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } }) : []

        let city;
        let street;
        const propertiesOptions = this.props.propertiesList.filter(i => i.status === true).map(item => {
            //const street = await postFunction('Property/GetStreetByID', item.CityID);
            city = this.props.cities.find(i => i.CityId === item.CityID)
            street = this.props.streets.find(i => i.CityId === item.CityID && i.StreetID === item.StreetID)

            return { id: item.PropertyID, name: item.PropertyID + ':' + street.StreetName + ' ' + item.Number + ' ,' + city.CityName }
        })
        let fieldsArray = [...this.state.fieldsArray];
        let fieldsToSearch = [...this.state.fieldsToSearch];
        //fieldsArray[0].selectOptions = propertiesOptions;
        fieldsArray[0].radioOptions = TaskTypeOptions;
        //fieldsToSearch[0].radioOptions = TaskTypeOptions;

        fieldsArray[2].radioOptions = ClassificationOptions;
        fieldsToSearch[0].radioOptions = ClassificationOptions;
        this.setState({ fieldsArray, fieldsToSearch, ClassificationOptions, TaskTypeOptions, propertiesOptions })

    }
    componentDidUpdate = (prevProps, PrevState) => {
        if (JSON.stringify(prevProps.taskTypes) !== JSON.stringify(this.props.taskTypes)) {
            const y = this.props.taskTypes;
            const TaskTypeOptions = y !== null ?
                y.map(item => { return { id: item.TaskTypeId, name: item.TaskTypeName } }) : []

            let city;
            let street;
            const propertiesOptions = this.props.propertiesList.filter(i => i.status === true).map(item => {
                //const street = await postFunction('Property/GetStreetByID', item.CityID);
                city = this.props.cities.find(i => i.CityId === item.CityID)
                street = this.props.streets.find(i => i.CityId === item.CityID && i.StreetID === item.StreetID)

                return { id: item.PropertyID, name: item.PropertyID + ':' + street.StreetName + ' ' + item.Number + ' ,' + city.CityName }
            })
            let fieldsArray = [...this.state.fieldsArray];


            fieldsArray[0].radioOptions = [...TaskTypeOptions];
            this.setState({ fieldsArray, TaskTypeOptions, propertiesOptions })

        }
    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
    }
    closeExtentionModal = () => {

        this.setState({ showEx: false, showExtention: null })
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
    submitForExtentions = async (type, object) => {
        const res = await CommonFunctions('Add', object, 'Task/AddTaskType');
        let list = await GetFunction('Task/GetAllTaskTypes');
        this.props.setTaskTypes(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Tasks' }} /> })

        if (res) {
            this.closeExtentionModal()
        }

    }
    submitSearch = async (object) => {
        const path = 'Task/Search';

        if (object) {
            let objects = await SearchFor(object, path)
            if (objects) {
                let name = 'תוצאות חיפוש'
                if (objects.length === 0) {
                    name = 'לא נמצאו תוצאות'
                }
                this.setState({ prevName: this.state.name, prevObjects: [...this.state.ObjectsArray], ObjectsArray: [] })
                const objArray = [...objects]
                this.setState({ ObjectsArray: objArray, name, fieldsToSearch: null })
            }
        }
    }
    submit = async (type, object) => {
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
            if (object.IsHandled !== true) {
                newObj.HandlingDate = null;
                newObj.HandlingWay = null;
            }
            else {
                if (object.HandlingDate && object.HandlingDate !== '')
                    newObj.HandlingDate = object.HandlingDate
                if (object.HandlingWay && object.HandlingWay !== '')
                    newObj.HandlingWay = object.HandlingWay
            }
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }
            object = newObj

        }
        else if (type === 'Delete') {
            const con = window.confirm('למחוק משימה?')
            if (con === false)
                return;
            object = { id: object.TaskID }
        }
        const res = await CommonFunctions(type, object, path)

        let list = await GetFunction('Task/GetAllTasks')
        this.props.setTasks(list !== null ? list : [])

        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        debugger
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Tasks' }} /> })
        return res
        // if (res && res !== null) {
        //     this.closeFormModal();
        // }
    }


    setForTable = () => {
        let LinksForTable = [];

        if (this.state.name === 'תוצאות חיפוש' || this.state.name === 'לא נמצאו תוצאות') {
            LinksForTable.push(<button type='button' onClick={() => {
                this.setState({
                    ObjectsArray: [...this.state.prevObjects], name: this.state.prevName,
                    fieldsToSearch: [
                        { field: 'ClassificationID', name: 'סווג', type: 'radio', radioOptions: this.state.ClassificationOptions },
                        { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }],
                })
            }}>חזרה ל{this.state.prevName}</button>)

        }
        else
        //(this.state.name !== 'משימות') 
        {
            LinksForTable.push(<button type='button' onClick={() => {
                this.setState({ type: '', name: 'משימות' })


            }}>חזרה למשימות</button>)
            // }
            // else
            LinksForTable.push(<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                            fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוסף'
                            setForForm={this.setForForm}
                            validate={this.validate} />
                })
            }} > הוספת משימה</button>)
            //,
            // <button type='button' onClick={async () => {
            //     const archivesTasks = await GetFunction('Task/GetAllarchivesTasks')
            //     if (archivesTasks)
            //         archivesTasks.map(i => i.status = undefined)
            //     this.setState({ ObjectsArray: archivesTasks, name: 'ארכיון המשימות' })
            // }}>לארכיון המשימות</button>

        }


        return { LinksForTable }
    }
    setForForm = object => {
        let LinksPerObject = []
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'נכס', type: 'select', index: 1, required: true, selectOptions: this.state.propertiesOptions })
            if (object.TaskTypeId === 1)
                fieldsToAdd.push({ field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })/*{ field: 'PropertyID', name: 'סווג לקוח', type: 'r', index: 1,selectOptions:this.state.propertiesOptions }*/
            const property = this.props.propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property.IsDivided) {
                const SubProperties = this.props.SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.filter(i => i.status === true).map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', required: true, type: 'select', index: 1, selectOptions: subPropertiesOptions });
            }

        }
        LinksPerObject.push(<button type='button' index={0} onClick={() => {
            this.setState({ showEx: true })
            this.setState({
                showExtention: <PopUpForProperties submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'name', name: 'סוג', type: 'text', required: true }]}
                    type='AddCity' isOpen={this.state.showEx} closeModal={this.closeExtentionModal} />
            })

        }}>הוסף סוג משימה</button>)


        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 4, required: true },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'texterea', index: 4 })
        fieldsToAdd.push({ ...AddDocField })

        const docks = this.props.documents.filter(i => i.type === 6 && i.DocUser === object.TaskID)
        if (docks && docks[0]) {

            LinksPerObject.push(<div index='end'> {DocDeleteButton(docks, this.props.setDocuments)}</div>)


        }
        return { fieldsToAdd, LinksPerObject };

    }
    set = (object) => {


        let LinksForEveryRow = []
        let ButtonsForEveryRow = []


        let LinksPerObject = [];
        let tempobject = { ...object }

        //postFunction('Property/GetPropertyByID', { id: object.PropertyID }).then(res => this.setState({ propertyObject: res }))
        const propertyObject = this.props.propertiesList.find(i => i.PropertyID === object.PropertyID)
        let typeObj = this.state.TaskTypeOptions.length > 0 ?
            this.state.TaskTypeOptions.find(obj => obj.id === object.TaskTypeId) : {}
        tempobject.TaskTypeId = typeObj.name
        let classifObj
        if (object.ClassificationID) {
            classifObj = this.state.ClassificationOptions.length > 0 ?
                this.state.ClassificationOptions.find(obj => obj.id === object.ClassificationID) : {}
            tempobject.ClassificationID = classifObj.name;
        }
        if (object.ClientClassificationID) {
            classifObj = this.state.ClassificationOptions.length > 0 ?
                this.state.ClassificationOptions.find(obj => obj.id === object.ClientClassificationID) : {}
            tempobject.ClientClassificationID = classifObj.name;
        }
        let fieldsToAdd = this.setForForm(object).fieldsToAdd;
        fieldsToAdd.pop();
        tempobject.DateForHandling = new Date(object.DateForHandling).toLocaleDateString();

        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            if (object.TaskTypeId === 1)
                tempobject.ReportDate = new Date(object.ReportDate).toLocaleDateString();
            tempobject.PropertyID = <Link onClick={() => {
                this.setState({ showDetails: true })
                this.setState({
                    showSomthing: <Properties object={propertyObject} type='details'
                        closeModal={this.closeDetailsModal} />
                })
            }}>{object.PropertyID}</Link>


            if (object.SubPropertyID !== null) {
                //postFunction('SubProperty/GetSubPropertyByID', { id: object.SubPropertyID }).then(res => this.setState({ spobjectres: res }))
                const spobject = this.props.SubPropertiesList.find(i => i.SubPropertiesID === object.SubPropertyID)
                LinksPerObject.push(<button type='button' onClick={() => {
                    this.setState({
                        showDetails: true, showSomthing:
                            <SubProperties object={spobject}
                                type='details' closeModal={this.closeDetailsModal} />
                    })
                }}>פרטי נכס מחולק</button>)//קישור לקומפוננטת נכסים והאוביקט הוא מה שיתקבל מהפונקציה של תת נכסים של נכס מסוים
            }
        }
        if (object.IsHandled) {
            object.HandlingDate = new Date(object.HandlingDate).toLocaleDateString();
            tempobject.IsHandled = 'V'
        }
        else
            tempobject.IsHandled = 'X'
        //postFunction('User/GetUserDocuments', { id: object.TaskID, type: 6 }).then(res => this.setState({ docks: res }))
        const docks = this.props.documents.filter(i => i.type === 6 && i.DocUser === object.TaskID)
        if (object.TaskTypeId === 1) {

            const rental = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.status === true)
            if (rental) {
                const renter = this.props.rentersList.find(i => i.UserID === rental.UserID && i.status === true)
                if (renter) {
                    let renterName = renter.FirstName !== null ? renter.FirstName : ''
                    renterName += renter.LastName !== null ? ' ' + renter.LastName : ''
                    LinksPerObject.push(<button type='button' index='end' onClick={() => {
                        this.setState({
                            showSomthing:
                                <Renter type='details' object={renter} closeModal={this.closeDetailsModal}
                                    user={this.props.user}
                                    setRenters={this.props.setRenters}
                                    setDocuments={this.props.setDocuments}
                                    rentersList={this.props.rentersList}
                                    documents={this.props.documents}
                                    propertiesList={this.props.propertiesList} rentalsList={this.props.rentalsList} />
                        })
                    }}>

                        מדווח:  {renterName} </button>)
                }
            }
        }
        if (docks && docks[0]) {
            fieldsToAdd = [{ ...DocField }]
            tempobject.doc = DocButtons(docks)
        }
        return {
            fieldsToAdd, LinksForEveryRow,
            ButtonsForEveryRow, object: tempobject, LinksPerObject
        };

    }
    rend = () => {
        if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2 && this.props.user.RoleID !== 3) {
            return <Redirect to='/a' />
        }

        if (this.state.type === 'report') {

            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={{ PropertyID: this.props.object.PropertyID, SubPropertyID: this.props.object.SubPropertyID }}
                name='שלח'
                type='Report'
                fieldsArray={[{ field: 'Description', name: 'תיאור הבעיה', type: 'texterea', required: true },
                { field: 'ClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.state.ClassificationOptions }
                ]}
                submit={this.props.submit} setForForm={this.props.setForForm}
                validate={this.props.validate} set={this.props.set}
            />
        }
        else if (this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) {
            return <Redirect to='/a' />
        }

        else if (this.state.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.props.closeModal}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}

            />

        }

        else if (this.state.type === 'form') {
            return <div><Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name='הוסף'
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate} />{this.state.showSomthing}{this.state.red}</div>
        }
        else if (this.state.type === 'table') {

            return <div><Table name={this.state.name}
                fieldsArray={this.state.fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable}
                set={this.set} setForForm={this.setForForm}
                delObject={this.submit}
                validate={this.validate} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />
                {this.state.showSomthing}{this.state.showExtention}{this.state.red}</div>
        }
        else {
            return <div>

                {this.state.name}
                <br /><br /><br />
                <button onClick={() => {
                    this.props.history.push(this.props.match.url + '/faults');
                    this.setState({ type: 'table', name: 'תקלות', ObjectsArray: this.props.tasksList.filter(i => i.status == true && i.TaskTypeId === 1) }); this.forceUpdate()
                }}>תקלות</button>
                <button onClick={() => {
                    this.props.history.push(this.props.match.url + '/renwes');
                    this.setState({ type: 'table', name: 'חוזים', ObjectsArray: this.props.tasksList.filter(i => i.status == true && i.TaskTypeId === 2) })
                }}>חוזים</button>
                <button onClick={() => {
                    this.props.history.push(this.props.match.url + '/meetings');
                    this.setState({ type: 'table', name: 'פגישות', ObjectsArray: this.props.tasksList.filter(i => i.status == true && i.TaskTypeId === 4) })
                }}>פגישות</button>
                <button onClick={() => {
                    this.props.history.push(this.props.match.url + '/cars');
                    this.setState({ type: 'table', name: 'רכבים', ObjectsArray: this.props.tasksList.filter(i => i.status == true && i.TaskTypeId === 5) })
                }}>רכבים</button>
                <button onClick={() => {
                    this.props.history.push(this.props.match.url + '/allTasks');
                    this.setState({ type: 'table', name: 'כל המשימות', ObjectsArray: this.props.tasksList.filter(i => i.status == true) })
                }}>כל המשימות</button>
                <button onClick={
                    async () => {
                        this.props.history.push(this.props.match.url + '/archivesTasks');
                        const archivesTasks = await GetFunction('Task/GetAllarchivesTasks')
                        if (archivesTasks)
                            archivesTasks.map(i => i.status = undefined)
                        this.setState({ type: 'table', ObjectsArray: archivesTasks, name: 'ארכיון המשימות' })
                    }
                }>ארכיון המשימות</button></div >

        }
    }
    render() {

        return (
            <div className="div-task-container">
                {this.rend()}
            </div>
        )

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tasks))
//export const tasksLists = [{ TaskID: 1, TaskTypeId: 4, Description: 'אאא', ClassificationID: 2, DateForHandling: '1/02/2018', IsHandled: false },
//{ TaskID: 2, TaskTypeId: 2, Description: 'sא', ClassificationID: 1, DateForHandling: '31/08/2018', IsHandled: true }];//
// GetFunction('Task/GetAllTasks');