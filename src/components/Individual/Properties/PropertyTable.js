import React, { Component, PureComponent } from 'react'
import Property from './Property'
import Table from '../../General/Table/Table'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { CommonFunctions, GetFunction, postFunction } from '../../General/CommonAxiosFunctions';


export class PropertyTable extends PureComponent {
    state = {
        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'radio', radioOptions: [{ id: 'true', name: 'מושכר' }, { id: 'false', name: 'לא מושכר' }] }]
    }
    delObject = async (object) => {

        let path = 'Property/DeleteProperty';
        const con = window.confirm('למחוק נכס?')
        if (con === false)
            return;
        object = { id: object.PropertyID }
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res)
    }
    setForTable = () => {
        let LinksForTable = []
        return { LinksForTable }
    }
    actions = (type, formType, formName, object, closeModal) => {
        return <Property
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
                    path='Property'
                    name='נכסים'
                    fieldsArray={this.props.fieldsArray}
                    objectsArray={this.props.objectsArray}
                    setForTable={this.setForTable}
                    set={this.props.set}
                    actions={this.actions}
                    delObject={this.delObject}
                    nameAdd='נכס'
                    showModal={this.props.showModal}
                    closeModal={this.props.closeModal}
                    fieldsToSearch={this.state.fieldsToSearch}
                />

            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertyTable))
