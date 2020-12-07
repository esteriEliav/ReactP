import React, { Component, PureComponent }
    from 'react'
import * as Action from '../../General/Action'
import Item from '../Item/Item'
import Search from '../Search'
import { Link } from 'react-router-dom'
import Details, { } from "../Details/Details";
import ReactExport from "react-export-excel";
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { CommonFunctions, GetFunction } from '../../General/CommonAxiosFunctions';

import './../../../App.css'
import './Table.css'
import Pic9 from '../../../pic9.png'


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




//קומפוננטה להצגת טבלה
export class Table extends PureComponent {
    state = {
        objectsArray: this.props.objectsArray,
        name: this.props.name,
        statusSearch: true,

    }
    componentDidUpdate = (prevProps, prevState) => {
        debugger
        if (prevProps.name !== this.props.name) {
            this.setState({ name: this.props.name })
        }
        if (prevProps.objectsArray !== this.props.objectsArray) {
            this.setState({ objectsArray: this.props.objectsArray })
        }
    }
    submitSearch = (objectsArray) => {

        if (objectsArray) {
            objectsArray = objectsArray.filter(object => JSON.stringify(this.props.objectsArray).includes(JSON.stringify(object)))
            let name = ' תוצאות חיפוש ' + this.props.name
            if (objectsArray.length === 0)
                name = 'לא נמצאו תוצאות'
            this.setState({ objectsArray: [] })
            this.setState({ objectsArray: objectsArray, name: name, statusSearch: false })
        }
    }
    linksForTable = () => {

        const some = this.props.setForTable().LinksForTable
        const links = []
        if (this.state.statusSearch) {
            if (this.props.actions)
                links.push(<button type='button' onClick={() => {
                    this.props.showModal(this.props.actions(Action.form, Action.Add, 'הוסף', {}, this.props.closeModal))
                }} > הוספת {this.props.nameAdd}</button>)
            some.map((lin, index) => links.push(<div key={index}> {lin} </div>))
        }
        else {
            links.push(<button
                onClick={() => this.setState({
                    objectsArray: [...this.props.objectsArray],
                    name: this.props.name,
                    statusSearch: true
                })}
            >חזרה ל{this.props.name}</button>)
        }
        return links
    }
    render() {
        return (
            <div className="div-all-container">
                <div className="div-container">
                    <header>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"></link>
                        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
                    </header>
                    <h1 className="name">{this.state.name}</h1>

                    {(this.props.fieldsToSearch !== null && this.props.fieldsToSearch !== undefined) && <Search
                        statusSearch={this.state.statusSearch}
                        path={this.props.path}
                        fieldsArray={this.props.fieldsToSearch}
                        Object={{}}
                        submit={this.submitSearch} />}

                    <div className="button-container">
                        {this.linksForTable()}
                    </div>
                    <table className="table">
                        {(this.props.user.RoleID === 1 || this.props.user.RoleID === 2) && <ExcelFile filename={this.props.name} element={<button> יצוא לאקסל </button>}>
                            <ExcelSheet data={this.state.objectsArray} name={this.props.name}>
                                {this.props.fieldsArray.map((item, index) => {
                                    return <ExcelColumn key={index} label={item.name} value={item.field} />
                                }
                                )}
                            </ExcelSheet>
                        </ExcelFile>}


                        <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) { return <th key={item.field}>{item.name}</th> } })}</tr>
                        {this.state.objectsArray.map(object => {
                            if (this.props.restore || (object.status && object.status === true))
                                return <Item
                                    key={object[this.props.fieldsArray[0].field]}
                                    fieldsArray={this.props.fieldsArray}
                                    Object={object}
                                    set={this.props.set}
                                    delObject={this.props.delObject}
                                    setForForm={this.props.setForForm}
                                    validate={this.props.validate}
                                    actions={this.props.actions}
                                    restore={this.props.restore} />
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
Table.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    fieldsArray: PropTypes.arrayOf(PropTypes.object),
    objectsArray: PropTypes.arrayOf(PropTypes.object),
    setForTable: PropTypes.func,
    set: PropTypes.func,
    actions: PropTypes.func,
    delObject: PropTypes.func,
    submitSearch: PropTypes.func,
    fieldsToSearch: PropTypes.arrayOf(PropTypes.object)
}
export default connect(mapStateToProps, mapDispatchToProps)(Table)
