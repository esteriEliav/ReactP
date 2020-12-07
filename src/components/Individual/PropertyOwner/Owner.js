import React, { Component, PureComponent } from 'react'
import Details from '../../General/Details/Details'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './PropertyOwner.css'
import { OwnerTable } from './OwnerTable';
import { OwnerForm } from './OwnerForm';


export class Owner extends PureComponent {
    state = {
        fieldsArray: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
        { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }],
        showSomthing: null,
        red: null
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }
    UpdateAfterAction = async (res) => {
        let list = await GetFunction('PropertyOwner/getAllOwners')
        this.props.setOwners(list !== null ? list : [])
        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/PropertyOwner' }} /> })
        return res
    }
    set = (object) => {

        let fieldsToAdd = []
        let ButtonsForEveryRow = []
        let LinksPerObject = []

        const properties = this.props.propertiesList.filter(i => i.OwnerID === object.OwnerID)
        let LinksForDetails = [<Link
            to={{
                pathname: '/Properties', objects: properties !== null ? properties : []
            }} >דירות</Link>]

        return {
            fieldsToAdd, object, LinksForDetails,
            ButtonsForEveryRow, LinksPerObject
        }
    }
    docks = (object) => {
        return this.props.documents.filter(i => i.type === 2 && i.DocUser === object.OwnerID)
    }
    rend = () => {
        let whatToRender = []
        if (this.props.type === 'details') {
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
        else if (this.props.type === 'form') {
            whatToRender.push(<OwnerForm
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
                <OwnerTable
                    {...this.props}
                    fieldsArray={this.state.fieldsArray}
                    setForTable={this.setForTable}
                    set={this.set}
                    delObject={this.delObject}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    UpdateAfterAction={this.UpdateAfterAction}
                    objectsArray={this.props.location && this.props.location.objects ? this.props.location.objects : this.props.ownersList}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Owner));
