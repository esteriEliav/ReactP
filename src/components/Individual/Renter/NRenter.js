
import React, { Component, PureComponent } from 'react'
import Details from '../../General/Details/Details'
import RenterForm from './RenterForm'
import RenterTable from './RenterTable';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CommonFunctions, CommonFunction, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import * as Action from '../../General/Action'
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
        fieldsArray: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' },
        { field: 'LastName', name: 'שם משפחה', type: 'text' }, { field: 'SMS', name: 'SMS', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g }
            , { field: 'UserName', name: 'שם משתמש', type: 'text' }, { field: 'Password', name: 'סיסמא', type: 'text' }],
        showSomthing: null,
        red: null

    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    UpdateAfterAction = async (res) => {
        let list = await GetFunction('Renter/GetAllRenters')

        this.props.setRenters(list !== null ? list : [])

        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Renter' }} /> })
        return res
    }
    set = (object) => {

        const rentals = this.props.rentalsList.filter(i => i.UserID === object.UserID)
        let properties = []
        rentals.map(item => { properties.push(...this.props.propertiesList.filter(i => i.PropertyID === item.PropertyID)) })

        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let fieldsToAdd = [];
        let LinksForDetails = [<Link
            to={{ pathname: '/Properties', objects: properties }}>דירות ששוכר</Link>]
        return {
            fieldsToAdd, object, LinksForDetails, ButtonsForEveryRow, LinksPerObject

        }
    }
    docks = object => {
        return this.props.documents.filter(i => i.type === 4 && i.DocUser === object.UserID)
    }
    rend = () => {
        let whatToRender = []
        if (this.props.type === Action.details) {
            const some = this.set(this.props.object)
            whatToRender.push(<Details
                closeModal={this.props.closeModal}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForDetails={some.LinksForDetails}
                fieldsToAdd={some.fieldsToAdd}
                docks={this.docks}
            />)

        }
        else if (this.props.type === Action.form) {
            whatToRender.push(<RenterForm
                {...this.props}
                closeFormModal={this.props.closeModal}
                object={this.props.object}
                formName={this.props.formName}
                formType={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                UpdateAfterAction={this.UpdateAfterAction}
                showModal={this.showModal}
                closeModal={this.closeModal}
                docks={this.docks}
            />)
        }
        else {
            whatToRender.push(
                <RenterTable
                    {...this.props}
                    fieldsArray={this.state.fieldsArray}
                    set={this.set}
                    delObject={this.delObject}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    UpdateAfterAction={this.UpdateAfterAction}
                    objectsArray={this.props.location && this.props.location.objects ? this.props.location.objects : this.props.rentersList}
                />

            )
        }
        whatToRender.push(this.state.showSomthing, this.state.red)
        return whatToRender
    }
    render() {

        return (

            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/' />}

            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Renter));
