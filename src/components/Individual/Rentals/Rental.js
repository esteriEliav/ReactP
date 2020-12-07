import React, { Component, PureComponent } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Details from '../../General/Details/Details';
import RentalTable from './RentalTable'
import NRenter from '../Renter/NRenter';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import PropertyOwner from '../PropertyOwner/Owner';
import Property from '../Properties/Property';
import SubProperties from '../SubProperties/SubProperties';
import * as Action from '../../General/Action'
import { toPropertiesOptions } from '../../General/CommonFunctions'
import './Rentals.css';
import { RentalForm } from './RentalForm';

/*
RentalID int  not null identity,
PropertyID int not null,
SubPropertyID int,
UserID int,--שוכר
RentPayment float,
PaymentTypeID int,
EnteryDate datetime,--תאריך תחילת חוזה
EndDate datetime,--תאריך סיום
ContactRenew bit constraint DF_Rentals_ContactRenew default 0,--האם לחדש חוזה
*/


export class Rental extends PureComponent {

    state = {
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'select', selectOptions: [] }, { field: 'UserID', name: 'שוכר', type: 'select', selectOptions: [], required: true },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio', radioOptions: this.props.paymentTypes ? [...this.props.paymentTypes] : [], required: true }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date', required: true },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date', required: true }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'Owner', name: 'שם משכיר', type: 'text' }, { field: 'User', name: 'שם שוכר ', type: 'text' },
        { field: 'EnteryDate', name: 'מתאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'עד תאריך סיום חוזה', type: 'date' }],
        showSomthing: null,
        PaymentTypeOptions: this.props.paymentTypes ? this.props.paymentTypes : [],
        red: null
    }
    comp = () => {
        let renters = this.props.rentersList.filter(i => i.status === true)
        renters = renters.map(item => { return { id: item.UserID, name: item.FirstName + ' ' + item.LastName } })
        const propertiesOptions = toPropertiesOptions(this.props.propertiesList, this.props.cities, this.props.streets)
        let fieldsArray1 = [...this.state.fieldsArray];
        fieldsArray1.find(i => i.field === 'PropertyID').selectOptions = propertiesOptions;
        fieldsArray1.find(i => i.field === 'UserID').selectOptions = renters;
        this.setState({ fieldsArray: fieldsArray1 })
    }
    componentWillMount = () => {
        this.comp()
    }
    componentDidUpdate = (prevProps, PrevState) => {
        if (JSON.stringify(prevProps.rentersList) !== JSON.stringify(this.props.rentersList) || JSON.stringify(prevProps.propertiesList) !== JSON.stringify(this.props.propertiesList)) {
            this.comp()
        }
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }

    UpdateAfterAction = async (res) => {
        let list = await GetFunction('Rental/GetAllRentals')
        this.props.setRentals(list !== null ? list : [])
        list = await GetFunction('Property/GetAllProperties')
        this.props.setProperties(list !== null ? list : [])
        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        list = await GetFunction('Task/GetAllTasks')
        this.props.setTasks(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Rentals' }} /> })
        return res

    }
    set = (object) => {
        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let tempObject = { ...object }
        let fieldsToAdd = []
        const property = this.props.propertiesList.find(i => i.PropertyID === object.PropertyID)

        const ownerObject = this.props.ownersList.find(i => i.OwnerID === property.OwnerID)

        const userObject = this.props.rentersList.find(i => i.UserID === object.UserID)

        tempObject.PropertyID = <Link onClick={() => {
            this.setState({
                showSomthing: <Property
                    {...this.props}
                    type={Action.details}
                    object={property !== null ? property : {}}
                    closeModal={this.closeModal} />
            })
        }}
        >{object.PropertyID}</Link>

        LinksPerObject.push(<button
            type='button' index={0} onClick={() => {
                this.setState({
                    showSomthing:
                        <Property
                            {...this.props}
                            type={Action.form}
                            formType={Action.form}
                            formName='ערוך'
                            object={property}
                            closeModal={this.closeModal} />

                })
            }}>ערוך פרטי נכס</button>)

        if (userObject) {
            let renterName = userObject.FirstName !== null ? userObject.FirstName : '';
            renterName += userObject.LastName !== null ? ' ' + userObject.LastName : '';
            tempObject.UserID = <Link onClick={() => {
                this.setState({
                    showSomthing:
                        <NRenter
                            {...this.props}
                            type={Action.details}
                            object={userObject !== null ? userObject : {}}
                            closeModal={this.closeModal}
                        />
                })
            }}>
                {renterName}</Link>
        }

        if (object.EnteryDate)
            tempObject.EnteryDate = new Date(object.EnteryDate).toLocaleDateString();
        if (object.EndDate)
            tempObject.EndDate = new Date(object.EndDate).toLocaleDateString();

        if (object.PaymentTypeID && this.state.PaymentTypeOptions.length > 0) {
            const PaymentType = this.state.PaymentTypeOptions.find(i => i.id === object.PaymentTypeID);
            tempObject.PaymentTypeID = PaymentType.name
        }
        if (object.ContactRenew)
            tempObject.ContactRenew = 'V'
        else
            tempObject.ContactRenew = 'X'
        if (ownerObject) {
            let ownerName = ownerObject.OwnerFirstName !== null ? ': ' + ownerObject.OwnerFirstName : '';
            ownerName += ownerObject.OwnerLastName !== null ? ' ' + ownerObject.OwnerLastName : '';
            LinksPerObject.push(<button type='button' index='end' onClick={() => {
                this.setState({
                    showSomthing: <PropertyOwner
                        type={Action.details}
                        object={ownerObject}
                        closeModal={this.closeModal}
                        propertiesList={this.props.propertiesList}
                        documents={this.props.documents} />
                })
            }}
            >משכיר{ownerName}</button>,

                <button type='button' index='end' onClick={() => {
                    this.setState({
                        showSomthing:
                            <PropertyOwner
                                type={Action.form}
                                formType={Action.Update}
                                formName='ערוך'
                                object={ownerObject}
                                closeModal={this.closeModal} />
                    })
                }}>
                    ערוך משכיר </button>)
        }

        if (object.SubPropertyID !== null) {
            const spobject = this.props.SubPropertiesList.find(i => i.SubPropertyID === object.SubPropertyID)
            LinksPerObject.push(<button type='button' index='end' onClick={() => {
                this.setState({
                    showSomthing:
                        <SubProperties
                            closeModal={this.closeModal}
                            object={spobject}
                            type={Action.details} />
                })
            }} >פרטי נכס מחולק </button>)

        }
        return {
            fieldsToAdd, ButtonsForEveryRow, object: tempObject, LinksPerObject
        };

    }
    docks = (object) => {
        return this.props.documents.filter(i => i.type === 3 && i.DocUser === object.RentalID)
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
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
                docks={this.docks}
            />)

        }
        else if (this.props.type === Action.form) {
            whatToRender.push(<RentalForm
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
                <RentalTable
                    {...this.props}
                    fieldsArray={this.state.fieldsArray}
                    set={this.set}
                    delObject={this.delObject}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    UpdateAfterAction={this.UpdateAfterAction}
                    objectsArray={this.props.location && this.props.location.objects ? this.props.location.objects : this.props.rentalsList}
                />
            )
        }
        whatToRender.push(this.state.showSomthing, this.state.red)
        return whatToRender
    }
    render() {
        return (
            <div>
                { (this.props.user.RoleID === 1 || this.props.user.RoleID === 2) ?
                    this.rend() : <Redirect to='/' />}
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rental))
