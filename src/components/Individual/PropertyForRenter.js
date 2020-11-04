import React, { Component } from 'react'
import Table from '../General/Table';
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions } from '../General/CommonFunctions';
import TaskObject from '../../Models-Object/TaskObject';
import { mapStateToProps ,mapDispatchToProps} from '../Login'
import { connect } from 'react-redux'
import Tasks from './Tasks';

export class PropertiesForRenter extends Component {
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray: this.props.location.objects,
        // [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 }]
        showSomthing: null,
        showForm: false
    }
    componentDidMount = () => {
        console.log(this.state)
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
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
        newObj.TaskID = 1
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

        let ButtonsForEveryRow = [<button type='button' onClick={() => {
            this.setState({ showForm: true })
            this.setState({
                showSomthing:
                    <Tasks type='report' isOpen={this.state.showForm} closeModal={this.closeFormModal}
                        object={object}
                        validate={this.validate} submit={this.submit} />
            })
        }}>דווח על תקלה</button>]




        return {
            fieldsToAdd: [], LinksForEveryRow: [], object, enable: false,
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
