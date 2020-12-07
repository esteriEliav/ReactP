import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './PropertyOwner.css'
import Owner from './Owner'
import { withRouter } from 'react-router-dom'
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';



export class OwnerTable extends PureComponent {
    state = {
        fieldsToSearch: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
        { field: 'Phone', name: 'טלפון', type: 'text', },
        { field: 'Email', name: 'אימייל', type: 'text' }],

    }
    setForTable = () => {
        let LinksForTable = []
        return { LinksForTable }
    }
    delObject = async (object) => {
        let path = 'PropertyOwner/DeletePropertyOwner';
        const con = window.confirm('למחוק משכיר?')
        if (con === false)
            return;
        object = { id: object.OwnerID }
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res)
    }
    actions = (type, formType, formName, object, closeModal) => {
        return <Owner
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
                    path='PropertyOwner'
                    name='משכירים'
                    fieldsArray={this.props.fieldsArray}
                    objectsArray={this.props.objectsArray}
                    setForTable={this.setForTable}
                    set={this.props.set}
                    actions={this.actions}
                    delObject={this.delObject}
                    nameAdd='משכיר'
                    showModal={this.props.showModal}
                    closeModal={this.props.closeModal}
                    fieldsToSearch={this.state.fieldsToSearch} />
            </div>


        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OwnerTable));


