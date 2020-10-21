import React, { Component } from 'react'
import Table from '../General/Table';
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions } from '../General/CommonFunctions';
import TaskObject from '../../Models-Object/TaskObject';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import Tasks from './Tasks';

export class PropertiesForRenter extends Component {
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray:/*this.props.location.objects*/[{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 },],//
        show: false,
        showSomthing: null
    }
    componentDidMount = () => {
        console.log(this.state)
    }
    // closeFormModal = () => {

    //     this.setState({ showForm: false })
    // }
    authorization = () => {
        if (this.props.user.RoleID === 3) {
            return null
        }
        return <Redirect to='/a' />
    }
    submit = (type, object) => {
        let path = 'Task/AddTask'
        let newObj = TaskObject()
        newObj.TaskID = 1
        // newObj.TaskTypeId = תקלה
        newObj.Description = object.Description
        newObj.PropertyID = object.PropertyID
        newObj.SubPropertyID = object.SubPropertyID
        newObj.ClientClassificationID = object.ClientClassificationID
        newObj.ReportDate = new Date()
        newObj.DateForHandling = new Date(new Date().setDate(new Date().getDate() + 7))
        newObj.IsHandled = false

        object = newObj


        return CommonFunctions(type, object, this.state.ObjectsArray, '/PropertiesForRenter', path)
    }
    validate = object => {
        let isErr = false
        let erors = []
        Object.keys(TaskObject()).map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.Description.split(/[^\s]+/).length > 3) {

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

        let ButtonsForEveryRow = [<button onClick={this.setState({
            show: true, showSomthing:
                <Tasks type='report'
                    object={object}
                    validate={this.validate} />
        }, console.log('this.state.showwww', this.state.show))}>דווח על תקלה</button>]




        return {
            fieldsToAdd: [], LinksForEveryRow: [], object, enable: false,
            ButtonsForEveryRow, LinksPerObject: []
        }
    }
    render() {
        return (
            <div>
                {this.authorization()}
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    setForTable={this.setForTable} setForForm={this.setForForm}
                    set={this.set} />
                {this.state.showSomthing}
            </div>
        )
    }
}

export default connect(mapStateToProps)(PropertiesForRenter)
