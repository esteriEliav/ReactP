import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table'
import { Link, Redirect, withRouter } from 'react-router-dom';
import * as Action from '../../General/Action'
import Details from '../../General/Details/Details';
import Renter from '../Renter/Renter';
import Properties from '../Properties/Properties';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import RentalObject from '../../../Models-Object/RentalObject';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Form from '../../General/Form/Form'
import Rental from './Rental'
import PropertyOwner from '../PropertyOwner/PropertyOwner';
import SubProperties from '../SubProperties/SubProperties';
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'
import { AddProperty, UpdateProperty, PropertyDetails } from '../Properties/PropertyNecActions';
import { AddOwner, UpdateOwner, OwnerDetails } from '../PropertyOwner/OwnerNecActions';
import './Rentals.css';
import RedirectTo from "../../RedirectTo";
import fileDownload from 'js-file-download'


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


export class Rentals extends PureComponent {

    state = {
        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'Owner', name: 'שם משכיר', type: 'text' }, { field: 'User', name: 'שם שוכר ', type: 'text' },
        { field: 'EnteryDate', name: 'מתאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'עד תאריך סיום חוזה', type: 'date' }],
    }
    setForTable = () => {
        let LinksForTable = []
        return {
            LinksForTable: LinksForTable
        }
    }
    delObject = async (object) => {

        const con = window.confirm('למחוק השכרה?')
        if (con === false)
            return;
        object = { id: object.RentalID }
        const path = 'Rental/DeleteRental'
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res)
    }
    actions = (type, formType, formName, object, closeModal) => {
        return <Rental
            type={type}
            formType={formType}
            formName={formName}
            object={object}
            closeModal={closeModal} />
    }
    render() {
        return (
            <div>
                <Table
                    path='Rental'
                    name='השכרות'
                    fieldsArray={this.props.fieldsArray}
                    objectsArray={this.props.objectsArray}
                    setForTable={this.setForTable}
                    set={this.props.set}
                    actions={this.actions}
                    delObject={this.delObject}
                    nameAdd='השכרה'
                    showModal={this.props.showModal}
                    closeModal={this.props.closeModal}
                    fieldsToSearch={this.state.fieldsToSearch} />
            </div>
        )



    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rentals))



//export const rentalsList = [{ RentalID: 1, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
//{ RentalID: 3, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }];
//res = await GetFunction('Rental/GetAllRentals') ;
