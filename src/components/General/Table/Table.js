import React, { Component } from 'react'
import Item from '../Item/Item'
import Search from '../Search'
import { Link } from 'react-router-dom'
import Details, { } from "../Details/Details";
import ReactExport from "react-export-excel";
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './../../../App.css'
import './Table.css'
import Pic9 from '../../../pic9.png'


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
            <div className="div-all-container">
                <div className="div-container">
                    <header>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"></link>
                        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
                    </header>
                    <h1 className="name">{this.props.name}</h1>

                    {this.props.fieldsToSearch && <Search

                        name='חיפוש'
                        fieldsArray={this.props.fieldsToSearch}
                        Object={{}}
                        submit={this.props.submitSearch} />}

                    <div className="button-container"> {some.LinksForTable.map((lin, index) => <div key={index}> {lin}
                        {lin.props.showForm}
                    </div>
                    )}  </div>
                    <table className="table">
                        {(this.props.user.RoleID === 1 || this.props.user.RoleID === 2) && <ExcelFile filename={this.props.name} element={<button> יצוא לאקסל </button>}>
                            <ExcelSheet data={this.props.objectsArray} name={this.props.name}>
                                {this.props.fieldsArray.map((item, index) => {

                                    return <ExcelColumn key={index} label={item.name} value={item.field} />
                                }
                                )}
                            </ExcelSheet>
                        </ExcelFile>}


                        <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                        {this.props.objectsArray.map(object => {

                            if (object.status === undefined || (object.status && object.status === true))
                                return <Item key={object[this.props.fieldsArray[0].field]}
                                    fieldsArray={this.props.fieldsArray} Object={object} set={this.props.set} submit={this.props.submit}
                                    setForForm={this.props.setForForm} validate={this.props.validate} />
                        }
                        )}

                    </table>
                    <div className="img-footer">
                        <img className='footer-img-right' src={Pic9}></img>
                        <img className='footer-img-left' src={Pic9}></img>
                        {/* <img className='footer-img-right' src={Pic9}></img> */}
                        <img className='footer-img-left' src={Pic9}></img>
                    </div>

                </div >
            </div>
        )
    }
}

export default connect(mapStateToProps)(Table)
