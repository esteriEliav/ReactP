
import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table'
import NRenter from './NRenter'
import { CommonFunctions, CommonFunction, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import * as Action from '../../General/Action'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Renter.css'


// public int UserID { get; set; }
// public string Name { get; set; }
// public string SMS { get; set; }
// public string Email { get; set; }
// public string Phone { get; set; }
// public int RoleID { get; set; }
// public string UserName { get; set; }
// public string Password { get; set; }


export class Renter extends PureComponent {
    state = {
        fieldsToSearch: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' }, { field: 'LastName', name: 'שם משפחה', type: 'text' },
        { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'text' }],
    }
    setForTable = () => {
        let LinksForTable = []
        LinksForTable = [
            <button type='button' onClick={async () => {
                const con = window.confirm('לשלוח?')
                if (con === true) {
                    let res;
                    res = await GetFunction('User/SendAllRenter')
                    if (res)
                        alert("נשלח")
                    else
                        alert("תקלה... לא נשלח")
                }
            }}>שליחת שם משתמש וסיסמא לכל השוכרים</button>]
        return { LinksForTable }
    }
    delObject = async (object) => {
        const con = window.confirm('למחוק שוכר?')
        if (con === false)
            return;
        object = { id: object.UserID }
        const path = 'Renter/DeleteRenter'
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res)
    }
    actions = (type, formType, formName, object, closeModal) => {
        return <NRenter
            type={type}
            formType={formType}
            formName={formName}
            object={object}
            closeModal={closeModal} />
    }
    render() {

        return (

            <Table
                path='Renter'
                name='שוכרים'
                fieldsArray={this.props.fieldsArray}
                objectsArray={this.props.objectsArray}
                setForTable={this.setForTable}
                set={this.props.set}
                actions={this.actions}
                delObject={this.delObject}
                nameAdd='שוכר'
                showModal={this.props.showModal}
                closeModal={this.props.closeModal}
                fieldsToSearch={this.state.fieldsToSearch} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Renter));
