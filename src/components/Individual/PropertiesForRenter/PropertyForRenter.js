import React, { Component, PureComponent } from 'react'
import PropertyForRenterForm from './PropertyForRenterForm'
import PropertyForRenterTable from './PropertyForRenterTable'
import * as Action from '../../General/Action'
import { Link, Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './PropertyForRenter.css';

export class PropertiesForRenter extends PureComponent {
    state = {
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityID', name: 'עיר', type: 'text' }, { field: 'StreetID', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        fieldsReportArray: [{ field: 'Description', name: 'תיאור הבעיה', type: 'texterea', required: true },
        { field: 'ClientClassificationID', name: 'רמת דחיפות', type: 'radio', radioOptions: this.props.classificationTypes ? [...this.props.classificationTypes] : [] }],
        showSomthing: null,
    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    set = object => {
        let tempobject = { ...object }
        if (object.StreetID) {
            const street = this.props.streets.find(i => i.CityId === object.CityID && i.StreetID == object.StreetID)
            tempobject.StreetID = street.StreetName
        }
        if (object.CityID) {
            const city = this.props.cities.find(i => i.id === object.CityID)
            tempobject.CityID = city.CityName
        }
        let ButtonsForEveryRow = [<button type='button' onClick={() => {
            this.setState({
                showSomthing:
                    <PropertyForRenterForm
                        closeModal={this.closeModal}
                        object={{}}
                        set={this.set}
                        fieldsArray={this.state.fieldsReportArray} />

            })
        }}>דווח על תקלה</button>]
        return {
            fieldsToAdd: [], object: tempobject, ButtonsForEveryRow, LinksPerObject: []

        }
    }
    render() {

        return (
            <div>
                {this.props.user.RoleID !== 3 && <Redirect to='/' />}
                <PropertyForRenterTable
                    {...this.props}
                    fieldsArray={this.state.fieldsPropertyArray}
                    set={this.set}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    objectsArray={this.props.propertiesList ? [...this.props.propertiesList] : []}
                    fieldsReportArray={this.state.fieldsReportArray}
                />
                {this.state.showSomthing}

            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertiesForRenter))
