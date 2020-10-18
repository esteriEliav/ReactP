import React, { Component } from 'react'
import Item from './Item'
import Form from './Form'
import Search from './Search'
import { Link } from 'react-router-dom'
import Details, { } from "./Details";



//קומפוננטה להצגת טבלה
export class Table extends Component {
    state = {
        showForm: false
    }
    closeFormModal = () => {
        this.setState({ showForm: false })

    }
    showForm = () => {

    }
    render() {
        const some = this.props.setForTable()
        return (
            <div>

                <h1>{this.props.name}</h1>

                {this.props.fieldsToSearch && <Search

                    name='חיפוש'
                    fieldsArray={this.props.fieldsToSearch}
                    Object={{}}
                    submit={this.props.submit} />}

                {some.LinksForTable.map((lin, index) => <div key={index}> {lin}
                    {lin.props.showForm()}

                </div>
                )}



                {some.ButtonsForTable.map((but, index) => <button key={index} onClick={but['onclick']}>{but['name']}</button>)}

                <table>
                    <tr> {this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                    {this.props.objectsArray.map(object =>

                        <Item key={Object[this.props.fieldsArray[0].field]}
                            fieldsArray={this.props.fieldsArray} Object={object} set={this.props.set} submit={this.props.submit}
                            setForForm={this.props.setForForm} />

                    )}

                </table>

            </div >
        )
    }
}

export default Table
