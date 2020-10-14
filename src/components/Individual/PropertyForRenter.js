import React, { Component } from 'react'
import Table from '../General/Table';
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunctions } from '../General/CommonFunctions';
import TaskObject from '../../Models-Object/TaskObject';

export class PropertiesForRenter extends Component {
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray: [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 },],//

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
            ButtonsForTable: [],
        }

    }
    setForForm = object => []
    set = object => {
        console.log('object', object)
        let LinksPerObject = [
            <Link to={{
                pathname: '/Tasks',
                type: 'report',
                PropertyID: object.PropertyID,
                SubPropertyID: object.SubPropertyID,
                validate: this.validate
            }}>דווח על תקלה</Link>
        ]
        return {
            fieldsToAdd: [], LinksForEveryRow: [],
            ButtonsForEveryRow: [], LinksPerObject: LinksPerObject
        }
    }
    render() {
        return (
            <div>

                <h1>{this.props.match.params.age}</h1>
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    setForTable={this.setForTable} setForForm={this.setForForm}
                    set={this.set} />
            </div>
        )
    }
}

export default PropertiesForRenter
