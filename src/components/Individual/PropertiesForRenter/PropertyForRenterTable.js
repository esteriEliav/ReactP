import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'

import './PropertyForRenter.css';
import { constrainPoint } from '@fullcalendar/react';

export class PropertiesForRenter extends PureComponent {
    state = {
        type: 'properties',
    }
    setForTable = () => {
        let LinksForTable = []
        LinksForTable.push([<button type='button' onClick={() => {
            this.setState({ type: 'report' })
            this.props.history.push(this.props.match.url + '/reports')
        }
        }>לדווחים שלי </button>])
        return {
            LinksForTable
        }
    }
    setForReportsTable = () => {
        let LinksForTable = []
        LinksForTable.push([<button type='button' onClick={() => {
            this.setState({ type: 'properties' })
            this.props.history.push('/propertiesForRenter')
        }
        }>חזרה לדירות </button>])
        return {
            LinksForTable
        }
    }
    reportsSet = (object) => {
        debugger
        let LinksForEveryRow = []
        let ButtonsForEveryRow = []
        let LinksPerObject = [];
        let tempobject = { ...object }
        let fieldsToAdd = []
        let classifObj
        if (object.ClientClassificationID) {
            classifObj = this.state.ClassificationOptions.length > 0 ?
                this.state.ClassificationOptions.find(obj => obj.id === object.ClassificationID) : {}
            tempobject.ClientClassificationID = classifObj.name;
        }
        return {
            fieldsToAdd, LinksForEveryRow,
            ButtonsForEveryRow, object: tempobject, LinksPerObject
        };
    }
    rend = () => {
        if (this.state.type === 'report') {
            let reports = []
            this.props.propertiesList.map(property => {
                reports.push(...this.props.tasksList.filter(i => i.TaskTypeId === 1 && i.PropertyID === property.PropertyID))
            })

            const fieldsArray = [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, ...this.props.fieldsReportArray]

            return <Table
                name='דווחים'
                fieldsArray={[...fieldsArray]}
                objectsArray={reports}
                setForTable={this.setForReportsTable}
                set={this.reportsSet}
            />
        }
        else {

            return <Table
                path='Task'
                name='הדירות שלך'
                fieldsArray={this.props.fieldsArray}
                objectsArray={this.props.propertiesList ? [...this.props.propertiesList] : []}
                setForTable={this.setForTable}
                set={this.props.set} />
        }
    }
    render() {
        return (
            this.rend()
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertiesForRenter))
