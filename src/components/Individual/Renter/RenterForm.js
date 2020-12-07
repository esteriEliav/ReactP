
import React, { Component, PureComponent } from 'react'
import Form from '../../General/Form/Form'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CommonFunctions, CommonFunction, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import RenterObject from '../../../Models-Object/UserObject'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import * as Action from '../../General/Action'
import { connect } from 'react-redux'
import './Renter.css'
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'


// public int UserID { get; set; }
// public string Name { get; set; }
// public string SMS { get; set; }
// public string Email { get; set; }
// public string Phone { get; set; }
// public int RoleID { get; set; }
// public string UserName { get; set; }
// public string Password { get; set; }


export class Renter extends PureComponent {


    validate = object => {
        let isErr = false
        let erors = []
        this.props.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        // if (object.SMS === '' && object.Email === '') {
        //     generalEror = 'SMS חובה להכניס אימייל או '
        //     isErr = true
        // }
        if ((object.FirstName === undefined || object.FirstName === '') && (object.LastName === undefined || object.LastName === '')) {
            generalEror = 'חובה להכניס שם או שם משפחה'
            isErr = true
        }
        if (!object.Email || object.Email === '') {
            erors.Email = 'חובה להכניס אימייל'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }

    submit = async (type, object) => {
        let path = 'Renter/' + type + 'Renter';
        let UserID = null, FirstName = null, LastName = null, SMS = null, Email = null, Phone = null, UserName = null, Password = null, Dock = null, docName = null
        if (type === Action.Add)
            UserID = 1
        else
            UserID = object.UserID
        if (object.FirstName !== '')
            FirstName = object.FirstName
        if (object.LastName !== '')
            LastName = object.LastName
        if (object.SMS !== '')
            SMS = object.SMS
        if (object.Email !== '')
            Email = object.Email
        if (object.Phone !== '')
            Phone = object.Phone
        if (object.UserName !== '')
            UserName = object.UserName
        if (object.Password !== '')
            Password = object.Password
        if (object.add) {
            docName = object.document
            Dock = object.add;
        }
        let newObj = new RenterObject(UserID, FirstName, LastName, SMS, Email, Phone, 3, UserName, Password, Dock, docName);

        object = newObj

        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res)

    }
    setForForm = object => {
        const fieldsToAdd = []
        let LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    render() {

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
                docks={this.props.docks}
            />
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Renter));
