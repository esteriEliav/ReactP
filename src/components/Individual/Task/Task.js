import React, { Component, PureComponent } from 'react'
import SubProperties from '../SubProperties/SubProperties'
import TaskForm from './TaskForm'
import TaskTable from './TaskTable'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Details from '../../General/Details/Details';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import * as Action from '../../General/Action'
import { connect } from 'react-redux'
import './Task.css';
import { DocButtons, DocDeleteButton, DocField, AddDocField, toPropertiesOptions } from '../../General/CommonFunctions'
import NRenter from '../Renter/NRenter'
import { Property } from '../Properties/Property'

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
export class Tasks extends PureComponent {
    state = {

        name: 'משימות',
        fieldsArray: [
            { field: 'TaskTypeId', name: 'סוג', type: 'radio', radioOptions: this.props.taskTypes ? [...this.props.taskTypes] : [], required: true },
            { field: 'Description', name: 'תיאור', type: 'texterea', required: true },
            { field: 'ClassificationID', name: 'סיווג', type: 'radio', radioOptions: this.props.classificationTypes ? [...this.props.classificationTypes] : [] },
            { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date', required: true },
            { field: 'IsHandled', name: 'טופל?', type: 'checkbox' }],
        ClassificationOptions: this.props.classificationTypes ? this.props.classificationTypes : [],
        TaskTypeOptions: this.props.taskTypes ? [...this.props.taskTypes] : [],
        propertiesOptions: [],

        type: this.props.location.type ? this.props.location.type : this.props.type,
        showSomthing: null,
        showExtention: null,
        code: this.props.location.code ? this.props.location.code : null,
        red: null
    }
    comp = () => {
        const propertiesOptions = toPropertiesOptions(this.props.propertiesList, this.props.cities, this.props.streets)
        this.setState({ propertiesOptions })
    }
    componentWillMount = () => {
        this.comp()
    }
    componentDidUpdate = (prevProps, PrevState) => {
        if (JSON.stringify(prevProps.propertiesList) !== JSON.stringify(this.props.propertiesList)) {
            this.comp()
        }

    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    showExtentionModal = (show) => {

        this.setState({ showExtention: show })
    }
    closeExtentionModal = () => {

        this.setState({ showExtention: null })
    }
    UpdateAfterAction = async (res, code) => {

        let list = await GetFunction('Task/GetAllTasks')
        this.props.setTasks(list !== null ? list : [])

        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Tasks', type: 'table', code: code }} /> })

        return res
    }
    redirect = () => {
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Tasks' }} /> })
    }
    fieldsToAddFunction = (object) => {
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'נכס', type: 'select', index: 1, required: true, selectOptions: this.state.propertiesOptions })
            if (object.TaskTypeId === 1)
                fieldsToAdd.push({ field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })
            const property = this.props.propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property.IsDivided) {
                const SubProperties = this.props.SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.filter(i => i.status === true).map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', required: true, type: 'select', index: 1, selectOptions: subPropertiesOptions });
            }
        }
        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 4, required: true },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'texterea', index: 4 })
        return fieldsToAdd
    }
    set = (object) => {
        let ButtonsForEveryRow = []
        let LinksPerObject = [];
        let tempobject = { ...object }
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
        let fieldsToAdd = [...this.fieldsToAddFunction(object)];
        tempobject.DateForHandling = new Date(object.DateForHandling).toLocaleDateString();

        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            if (object.TaskTypeId === 1)
                tempobject.ReportDate = new Date(object.ReportDate).toLocaleDateString();
            tempobject.PropertyID = <Link onClick={() => {
                this.setState({
                    showSomthing: <Property
                        {...this.props}
                        type={Action.details}
                        object={propertyObject}
                        closeModal={this.closeModal} />

                })
            }}>{object.PropertyID}</Link>
            if (object.SubPropertyID !== null) {
                const spobject = this.props.SubPropertiesList.find(i => i.SubPropertiesID === object.SubPropertyID)
                LinksPerObject.push(<button type='button' onClick={() => {
                    this.setState({
                        showSomthing:
                            <SubProperties
                                {...this.props}
                                object={spobject}
                                type={Action.details}
                                closeModal={this.closeDetailsModal} />
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
        if (object.TaskTypeId === 1) {
            const rental = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.SubPropertyID === object.SubPropertyID && i.status === true)
            if (rental) {
                const renter = this.props.rentersList.find(i => i.UserID === rental.UserID && i.status === true)
                if (renter) {
                    let renterName = renter.FirstName !== null ? renter.FirstName : ''
                    renterName += renter.LastName !== null ? ' ' + renter.LastName : ''
                    LinksPerObject.push(<button type='button' index='end' onClick={() => {
                        this.setState({
                            showSomthing:
                                <NRenter
                                    {...this.props}
                                    type={Action.details}
                                    object={renter}
                                    closeModal={this.closeModal}
                                />
                        })
                    }}>
                        מדווח:  {renterName} </button>)
                }
            }
        }
        return {
            fieldsToAdd, ButtonsForEveryRow, object: tempobject, LinksPerObject
        };

    }
    return = () => {
        this.setState({ type: '', name: 'משימות' })
    }
    docks = object => {
        return this.props.documents.filter(i => i.type === 6 && i.DocUser === object.TaskID)

    }
    historyPush = (path) => {
        debugger
        if (!this.props.history.location.pathname.includes(path))
            this.props.history.push(this.props.match.url + path);
    }
    whichType = (path, TaskTypeId) => {
        this.historyPush(path)
        return this.props.tasksList.filter(i => i.status == true && i.TaskTypeId === TaskTypeId)
    }
    rend = () => {
        let whatToRender = []
        if (this.state.type === Action.details) {
            const some = this.set(this.props.object)
            whatToRender.push(<Details
                closeModal={this.props.closeModal}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
                docks={this.docks}

            />)
        }

        else if (this.state.type === Action.form) {
            whatToRender.push(<TaskForm
                {...this.props}
                closeFormModal={this.props.closeModal}
                object={this.props.object}
                formName={this.props.formName}
                formType={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                UpdateAfterAction={this.UpdateAfterAction}
                showModal={this.showModal}
                closeModal={this.closeModal}
                showExtentionModal={this.showExtentionModal}
                closeExtentionModal={this.closeExtentionModal}
                propertiesOptions={this.state.propertiesOptions}
                docks={this.docks}
                code={this.props.code}


            />)
        }

        else if (this.state.type === 'table') {
            let objects = this.props.location && this.props.location.objects ? [...this.props.location.objects] : [...this.props.tasksList]
            let name = this.state.name
            let isRestore = false
            if (this.state.code === 1) {
                name = 'תקלות'
                objects = this.whichType('/faults', 1)
            }
            else if (this.state.code === 2) {
                name = 'חוזים'
                objects = this.whichType('/renews', 2)

            }
            else if (this.state.code === 4) {
                name = 'פגישות'
                objects = this.whichType('/meetings', 4)

            }
            else if (this.state.code === 5) {
                name = 'רכבים'
                objects = this.whichType('/cars', 5)
            }
            else if (this.state.code === 6) {
                this.historyPush('/allTasks')
                name = 'כל המשימות'

                objects = this.props.tasksList.filter(i => i.status == true)
            }
            else if (this.state.code === 7 && this.state.name !== 'ארכיון המשימות' && this.props.match.url) {
                this.historyPush('/archivesTasks')
                name = 'ארכיון המשימות'
                objects = this.props.tasksList.filter(i => i.status == false)
                isRestore = true
            }
            whatToRender.push(<TaskTable
                {...this.props}
                name={name}
                fieldsArray={this.state.fieldsArray}
                set={this.set}
                showModal={this.showModal}
                closeModal={this.closeModal}
                objectsArray={objects}
                return={this.return}
                code={this.state.code}
                isRestore={isRestore}
                UpdateAfterAction={this.UpdateAfterAction}
            />)

        }
        else {
            return <div>

                {this.state.name}
                <br /><br /><br />
                <button onClick={() => {
                    this.setState({ type: 'table', code: 1 })
                }}>תקלות</button>
                <button onClick={() => {
                    this.setState({ type: 'table', code: 2 })
                }}>חוזים</button>
                <button onClick={() => {
                    this.setState({ type: 'table', code: 4 })
                }}>פגישות</button>
                <button onClick={() => {
                    this.setState({ type: 'table', code: 5 })
                }}>רכבים</button>
                <button onClick={() => {
                    this.setState({ type: 'table', code: 6 })
                }}>כל המשימות</button>
                <button onClick={() => this.setState({ type: 'table', code: 7 })
                }>ארכיון המשימות</button>
            </div >
        }
        whatToRender.push(this.state.showSomthing, this.state.showExtention, this.state.red)
        return whatToRender
    }

    render() {

        return (
            <div className="div-task-container">
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/' />}
            </div>
        )

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tasks))