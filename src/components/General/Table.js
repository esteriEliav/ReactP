import React, { Component } from 'react'
import Item from './Item/Item'
import Form from './Form'
import Search from './Search'
import { Link } from 'react-router-dom'
import Details, { } from "./Details";
import ReactExport from "react-export-excel";
import { mapStateToProps } from '../Login/Login'
import { connect } from 'react-redux'


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




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
                    submit={this.props.submitSearch} />}

                {some.LinksForTable.map((lin, index) => <div key={index}> {lin}
                    {lin.props.showForm}
                </div>
                )}
                <table>
                    {(this.props.user.RoleID === 1 || this.props.user.RoleID === 2) && <ExcelFile filename={this.props.name} element={<button> יצוא לאקסל </button>}>
                        <ExcelSheet data={this.props.objectsArray} name={this.props.name}>
                            {this.props.fieldsArray.map((item, index) => {

                                return <ExcelColumn key={index} label={item.name} value={item.field} />
                            }
                            )}
                        </ExcelSheet>
                    </ExcelFile>}


                    <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                    {this.props.objectsArray.map(object =>

                        <Item key={object[this.props.fieldsArray[0].field]}
                            fieldsArray={this.props.fieldsArray} Object={object} set={this.props.set} submit={this.props.submit}
                            setForForm={this.props.setForForm} validate={this.props.validate} />

                    )}

                </table>

            </div >
        )
    }
}

export default connect(mapStateToProps)(Table)
