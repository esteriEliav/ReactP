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
                { this.props.LinksForTable.map((lin, index) => <div key={index}> <Link to={lin.link}
                    fieldsArray={this.props.fieldsArray} Object={null}
                    LinksForEveryRow={this.props.LinksForEveryRow} ButtonsForEveryRow={this.props.ButtonsForEveryRow}
                    fieldsToAdd={this.props.fieldsToAdd}>
                    {lin.name}</Link>
                </div>
                )}
                { this.props.ButtonsForTable.map((but, index) => <button key={index} onClick={but['onclick']}>{but['name']}</button>)}

                <table>
                    <tr> {this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                    {this.props.objectsArray.map(Object =>


                        <Item key={Object[this.props.fieldsArray[0].field]}
                            fieldsArray={this.props.fieldsArray} Object={Object} set={this.props.set} />

                    )}

                </table>
            </div >
        )
    }
}

export default Table
