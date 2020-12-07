import React, { Component, PureComponent } from 'react'
import PopUpForProperties from '../PopUpForProperty/PopUpForProperties'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Form from '../../General/Form/Form';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import TaskObject from '../../../Models-Object/TaskObject'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Task.css';
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'


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


    validate = object => {
        let isErr = false
        let erors = []
        this.props.fieldsArray.map(field => { erors[field.field] = "" })
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
        this.props.redirect()
        if (res) {
            this.props.closeExtentionModal()
        }

    }
    submit = async (type, object) => {
        let path = 'Task/' + type + 'Task';
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
        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res, this.props.code)
    }
    setForForm = object => {
        let LinksPerObject = []
        let fieldsToAdd = [];
        if (object.TaskTypeId === 1 || object.TaskTypeId === 2) {
            fieldsToAdd.push({ field: 'PropertyID', name: 'נכס', type: 'select', index: 1, required: true, selectOptions: this.props.propertiesOptions })
            if (object.TaskTypeId === 1)
                fieldsToAdd.push({ field: 'ReportDate', name: 'תאריך פניה', type: 'date', index: 2 })
            const property = this.props.propertiesList.find((item => item.PropertyID === object.PropertyID))

            if (property && property.IsDivided) {
                const SubProperties = this.props.SubPropertiesList.filter(item => item.PropertyID === object.PropertyID)
                const subPropertiesOptions = SubProperties.filter(i => i.status === true).map(item => { return { id: item.SubPropertyID, name: item.num } })
                fieldsToAdd.push({ field: 'SubPropertyID', name: 'סווג לקוח', required: true, type: 'select', index: 1, selectOptions: subPropertiesOptions });
            }

        }
        LinksPerObject.push(<button type='button' index={0} onClick={() => {

            this.props.showExtentionModal(
                <PopUpForProperties
                    submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'name', name: 'סוג', type: 'text', required: true }]}
                    type=''
                    closeModal={this.props.closeExtentionModal} />
            )
        }}>הוסף סוג משימה</button>)
        if (object.IsHandled)
            fieldsToAdd.push({ field: 'HandlingDate', name: 'תאריך טיפול', type: 'date', index: 4, required: true },
                { field: 'HandlingWay', name: 'אופן טיפול', type: 'texterea', index: 4 })
        fieldsToAdd.push()
        return { fieldsToAdd, LinksPerObject };
    }
    render() {

        return (
            <div className="div-task-container">
                <Form
                    closeModal={this.props.closeFormModal}
                    Object={this.props.object}
                    name={this.props.formName}
                    type={this.props.formType}
                    fieldsArray={this.props.fieldsArray}
                    submit={this.submit}
                    setForForm={this.setForForm}
                    validate={this.validate}
                    docks={this.props.docks}
                />
            </div>
        )

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tasks))
