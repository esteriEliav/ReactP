import React, { Component } from 'react'
import Table from '../../General/Table';
import { Link, Redirect } from 'react-router-dom';
import Axios from "../../Axios";
import { CommonFunctions } from '../../General/CommonFunctions';
import TaskObject from '../../../Models-Object/TaskObject';
import { mapStateToProps ,mapDispatchToProps} from '../../Login/Login'
import { connect } from 'react-redux'
import Tasks from '../Task/Tasks';
import RedirectTo from "../../RedirectTo";

import './PropertyForRenter.css';

export class PropertiesForRenter extends Component {
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityID', name: 'עיר', type: 'text' }, { field: 'StreetID', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray: this.props.propertiesList,
        // [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 }]
        showSomthing: null,
        showForm: false
    }
    
    closeFormModal = () => {

        this.setState({  showSomthing: null })
    }
    authorization = () => {
        if (this.props.user.RoleID === 3) {
            return null
        }
        return <Redirect to='/a' />
    }
    submit = async (type, object) => {
        let path = 'Task/AddTask'
        let newObj = TaskObject()
        
        newObj.TaskTypeID = 1
        newObj.Description = object.Description
        newObj.PropertyID = object.PropertyID
        newObj.SubPropertyID = object.SubPropertyID
        newObj.ClientClassificationID = object.ClientClassificationID
        newObj.ReportDate = new Date()
        newObj.DateForHandling = new Date(new Date().setDate(new Date().getDate() + 7))
        newObj.IsHandled = false

        object = newObj

        // return <CommonFunctions type='Add' object={object} redirect='/PropertiesForRenter' path={path} />
        const res = await CommonFunctions(type, object, path);
        if (res && res !== null) {
            this.closeFormModal();
        }

    }
    validate = object => {
        let isErr = false
        let erors = []
        Object.keys(TaskObject()).map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.Description.split(/[^\s]+/).length > 50) {

            erors.Description = 'עד 50 מילים'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }

    setForTable = () => {
        return {
            LinksForTable: [],

        }

    }
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = object => {
        let tempobject={...object}
         debugger
        
        const street=this.props.streets.find(i => i.CityId === object.CityID && i.StreetID==object.StreetID)
        tempobject.StreetID=street.StreetName
        const city=this.props.cities.find(i => i.CityId === object.CityID)
        tempobject.CityID = city.CityName
       
        let ButtonsForEveryRow = [<button type='button' onClick={() => {
            this.setState({ showForm: true })
            this.setState({
                showSomthing:
                    <Tasks type='report'  closeModal={this.closeFormModal}
                        object={object}
                        validate={this.validate} submit={this.submit} set={this.set}
                        setForForm={this.setForForm}/>
            })
        }}>דווח על תקלה</button>]




        return {
            fieldsToAdd: [], LinksForEveryRow: [], object:tempobject, enable: false,
            ButtonsForEveryRow, LinksPerObject: []
        }
    }
    render() {
       
        return (
            <div>
                {this.props.user.RoleID !== 3 && <Redirect to='/a' />}
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    setForTable={this.setForTable} setForForm={this.setForForm}
                    set={this.set} />
                {this.state.showSomthing}

            </div>
        )
    }
}

export default connect (mapStateToProps,mapDispatchToProps)(PropertiesForRenter)
