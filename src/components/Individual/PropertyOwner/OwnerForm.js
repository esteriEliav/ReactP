import React, { Component, PureComponent } from 'react'
import Form from '../../General/Form/Form'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { CommonFunctions } from '../../General/CommonAxiosFunctions';
import PropertyOwnerObject from '../../../Models-Object/PropertyOwnerObject';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import * as Action from '../../General/Action'
import './PropertyOwner.css'


export class OwnerForm extends PureComponent {

    submit = async (type, object) => {

        let path = 'PropertyOwner/' + type + 'PropertyOwner';
        let OwnerID = object.OwnerID, OwnerFirstName = null, OwnerLastName = null, Phone = null, Email = null, Dock = null, docName = null

        if (type === Action.Add)
            OwnerID = 1
        if (object.OwnerFirstName !== '')
            OwnerFirstName = object.OwnerFirstName
        if (object.OwnerLastName !== '')
            OwnerLastName = object.OwnerLastName
        if (object.Phone !== '')
            Phone = object.Phone
        if (object.Email !== '')
            Email = object.Email
        if (object.add !== '') {
            docName = object.document
            Dock = object.add;

        }

        object = new PropertyOwnerObject(OwnerID, OwnerFirstName, OwnerLastName, Phone, Email, Dock, docName)
        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res)

    }
    validate = object => {
        let isErr = false
        let erors = []
        this.props.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if ((object.OwnerFirstName === undefined || object.OwnerFirstName === '') && (object.OwnerLastName === undefined || object.OwnerLastName === '')) {
            generalEror = 'חובה להכניס שם או שם משפחה'
            isErr = true
        }
        if (!((object.Phone && object.Phone !== '') || (object.Email !== '' && object.Email))) {
            generalEror = 'חובה להכניס אימייל או טלפון'
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
        debugger
        return (

            <Form
                closeModal={this.props.closeFormModal}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.props.fieldsArray}
                submit={this.submit}
                setForForm={this.setForForm}
                validate={this.validate}
                docks={this.props.docks} />
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OwnerForm))
