import React, { Component } from 'react'
import Table from '../General/Table';


export class Main extends Component {
    state = {
        name: 'הדירות שלך',
        fieldsPropertyArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }],
        PropertiesArray: [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2 },],//
        LinksForEveryRow: [{ name: 'לדווח על תקלה', link: '/ReportForm', index: 'end' }],
        LinksForTable: [],
        ButtonsForEveryRow: [],
        ButtonsForTable: [],
        fieldsToAdd: [],

    }
    set = (object) => {
        return {
            fieldsToAdd: this.state.fieldsToAdd, LinksForEveryRow: this.state.LinksForEveryRow,
            ButtonsForEveryRow: this.state.ButtonsForEveryRow, LinksPerObject: []
        }
    }
    render() {
        return (
            <div>

                <Table name={this.state.name} fieldsArray={this.state.fieldsPropertyArray} objectsArray={this.state.PropertiesArray}
                    LinksForTable={this.state.LinksForTable}
                    ButtonsForTable={this.state.ButtonsForTable}

                    set={this.set} />
            </div>
        )
    }
}

export default Main
