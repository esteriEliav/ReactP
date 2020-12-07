import React, { Component, PureComponent } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Renter from '../Renter/Renter';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import RentalObject from '../../../Models-Object/RentalObject';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Form from '../../General/Form/Form'
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'
import * as Action from '../../General/Action'
import Property from '../Properties/Property';
import './Rentals.css';



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


export class RentalForm extends PureComponent {

    validate = object => {
        let isErr = false
        let erors = []
        this.props.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''

        if (object.RentPayment && object.RentPayment !== '' && (parseFloat(object.RentPayment).toString() !== object.RentPayment.toString())) {
            erors.RentPayment = 'נא להקיש סכום'
            isErr = true
        }
        if (object.EnteryDate > object.EndDate) {
            generalEror = 'תאריך כניסה מאוחר מתאריך יציאה'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submit = async (type, object) => {
        let path = 'Rental/' + type + 'Rental'
        let newObj = RentalObject()
        let property = this.props.propertiesList.find(i => i.PropertyID === object.PropertyID)
        if (property) {
            if (property.IsRented === true) {
                const rental = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.status === true)

                if (rental && rental.PropertyID !== object.PropertyID) {
                    const bool = window.confirm('כבר קימת השכרה לנכס זה, להחליף?')
                    if (bool === true) {
                        await postFunction('Rental/DeleteRental', { id: rental.RentalID })
                    }
                    else
                        object.PropertyID = rental.PropertyID
                }
            }
            if (property.IsRented !== true) {
                property.IsRented = true;
                postFunction('Property/UpdateProperty', property);
            }
            if (type === 'Add') {
                newObj.RentalID = 1

            }
            else
                newObj.RentalID = object.RentalID
        }
        newObj.PropertyID = object.PropertyID
        newObj.SubPropertyID = object.SubPropertyID
        newObj.UserID = object.UserID
        if (object.RentPayment && object.RentPayment !== '')
            newObj.RentPayment = parseFloat(object.RentPayment)
        newObj.PaymentTypeID = object.PaymentTypeID
        if (object.EnteryDate && object.EnteryDate !== '')
            newObj.EnteryDate = object.EnteryDate
        if (object.EndDate && object.EndDate !== '')
            newObj.EndDate = object.EndDate
        newObj.ContactRenew = object.ContactRenew
        if (object.add) {
            newObj.docName = object.document
            newObj.Dock = object.add

        }
        object = newObj

        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res)

    }
    linkToAddProperty = <button type='button' index={0} onClick={() => {
        this.props.showModal(
            <Property
                {...this.props}
                type={Action.form}
                formType={Action.form}
                formName='הוסף'
                closeModal={this.props.closeModal}
                object={{}} />)
    }}  >הוסף נכס</button>
    linkToAddRenter = <button type='button' index={1} onClick={() => {
        this.props.showModal(
            <Renter
                {...this.props}
                type={Action.form}
                formType={Action.form}
                formName='הוסף'
                closeModal={this.props.closeModal}
                object={{}}
            />)
    }}
    >הוסף שוכר</button>
    setForForm = object => {
        let LinksPerObject = [this.linkToAddProperty, this.linkToAddRenter]
        const fieldsToAdd = []
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
                docks={this.props.docks} />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RentalForm))