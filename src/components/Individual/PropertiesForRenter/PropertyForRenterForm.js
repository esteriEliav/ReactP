import React, { Component, PureComponent } from 'react'
import Form from '../../General/Form/Form';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { CommonFunctions, GetFunction } from '../../General/CommonAxiosFunctions';
import TaskObject from '../../../Models-Object/TaskObject';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'

import './PropertyForRenter.css';

export class PropertiesForRenter extends PureComponent {
    submit = async (type, object) => {
        let path = 'Task/AddTask'
        let newObj = TaskObject()
        newObj.TaskTypeID = 1
        newObj.Description = object.Description
        newObj.PropertyID = object.PropertyID
        newObj.SubPropertyID = object.SubPropertyID
        newObj.ClientClassificationID = object.ClientClassificationID
        newObj.ReportDate = new Date()
        newObj.DateForHandling = new Date(new Date().setDate(new Date().getDate() + 7))
        newObj.IsHandled = false
        object = newObj

        const res = await CommonFunctions(type, object, path);
        let list = await GetFunction('Property/GetAllProperties')
        this.props.setProperties(list !== null ? list : [])
        if (res && res !== null) {
            this.closeFormModal();
        }

    }
    validate = object => {
        let isErr = false
        let erors = []
        Object.keys(TaskObject()).map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.Description.split(/[^\s]+/).length > 50) {

            erors.Description = 'עד 50 מילים'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    render() {

        return (
            <Form
                closeModal={this.props.closeModal}
                Object={{ PropertyID: this.props.object.PropertyID, SubPropertyID: this.props.object.SubPropertyID }}
                name='שלח'
                type='Report'
                fieldsArray={this.props.fieldsArray}
                submit={this.submit}
                setForForm={this.setForForm}
                validate={this.validate}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertiesForRenter))
