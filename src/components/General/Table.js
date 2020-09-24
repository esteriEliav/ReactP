import React, { Component } from 'react'
import Item from './Item'
import Form from './Form'
import { Link } from 'react-router-dom'
import Details, { } from "./Details";




export class Table extends Component {

    render() {
        return (
            <div>

                <h1>{this.props.name}</h1>

                {this.props.fieldsToSearch && <Form location={{
                    name: 'חיפוש', type: 'Search', fieldsArray: this.props.fieldsToSearch, Object: null,
                    LinksForEveryRow: [], ButtonsForEveryRow: [],
                    fieldsToAdd: [], erors: [], submit: this.props.submit
                }}></Form>}




                { this.props.LinksForTable.map((lin, index) => <div key={index}> <Link to={{
                    pathname: lin.link,
                    fieldsArray: this.props.fieldsArray, Object: {}, erors: [], submit: this.props.submit, type: lin.type, name: lin.name,
                    LinksForEveryRow: [], ButtonsForEveryRow: [],
                    fieldsToAdd: []
                }}>
                    {lin.name}</Link>
                </div>
                )}
                { this.props.ButtonsForTable.map((but, index) => <button key={index} onClick={but['onclick']}>{but['name']}</button>)}

                <table>
                    <tr> {this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                    {this.props.objectsArray.map(object =>

                        <Item key={Object[this.props.fieldsArray[0].field]}
                            fieldsArray={this.props.fieldsArray} Object={object} set={this.props.set} submit={this.props.submit} />
                    )}

                </table>
            </div >
        )
    }
}

export default Table
