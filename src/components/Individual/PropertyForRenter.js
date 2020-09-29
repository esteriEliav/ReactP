import React, { Component } from 'react'
import Table from '../General/Table';
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";

export class Main extends Component {
    submit = (type, object) => {
        let x = false;
        x = this.addObject(object)
        if (x)
            return <Redirect to='/PropertiyForRenter' />
        return null;
    }
    addObject = (object) => {
        object.PropertyID = 1;

        Axios.post('Task/AddTask', object).then(x => { alert('הנכס עודכן בהצלחה') });
        //תנאי שבודק אם הבקשת הפוסט התקבלה
        return true;
    }
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray: [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 },],//

    }
    setForTable = () => {
        return {
            LinksForTable: [],
            ButtonsForTable: [],
        }

    }
    set = (object) => {
        let LinksForEveryRow = [{ type: 'Add', name: 'לדווח על תקלה', link: '/ReportForm', index: 'end' }]
        return {
            fieldsToAdd: [], LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: [], LinksPerObject: []
        }
    }
    render() {
        return (
            <div>

                <h1>{this.props.match.params.age}</h1>
                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    setForTable={this.setForTable}
                    set={this.set} />
            </div>
        )
    }
}

export default Main
