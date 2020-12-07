import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table'
import * as Action from '../../General/Action'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Task.css';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import Task from './Task'

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
        fieldsToSearch: [{ field: 'ClassificationID', name: 'סיווג', type: 'radio', radioOptions: this.props.classificationTypes ? [...this.props.classificationTypes] : [] },
        { field: 'DateForHandling', name: 'תאריך לטיפול', type: 'date' }],
    }
    setForTable = () => {
        let LinksForTable = [];
        LinksForTable.push(<button type='button' onClick={() => {
            this.props.return()
            this.props.history.push('/Tasks')
        }}>חזרה לתפריט</button>)
        return { LinksForTable }
    }
    delObject = async (object) => {

        const con = window.confirm('למחוק משימה?')
        if (con === false)
            return;
        object = { id: object.TaskID }
        const path = 'Task/DeleteTask';
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res, this.props.code)
    }
    restore = async (object) => {
        object.status = true
        const res = await CommonFunctions('Update', object, 'Task/UpdateTask')
        return this.props.UpdateAfterAction(res, this.props.code)
    }
    actions = (type, formType, formName, object, closeModal) => {
        return <Task
            type={type}
            formType={formType}
            formName={formName}
            object={object}
            code={this.props.code}
            closeModal={closeModal} />
    }
    render() {
        let restore = null
        if (this.props.isRestore)
            restore = this.restore
        return (
            <Table
                path='Task'
                name={this.props.name}
                fieldsArray={this.props.fieldsArray}
                objectsArray={this.props.objectsArray}
                setForTable={this.setForTable}
                set={this.props.set}
                actions={this.actions}
                delObject={this.delObject}
                nameAdd='משימה'
                showModal={this.props.showModal}
                closeModal={this.props.closeModal}
                fieldsToSearch={this.state.fieldsToSearch}
                restore={restore} />
        )

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tasks))