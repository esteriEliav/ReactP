import React, { Component, PureComponent } from 'react'
import { Link } from 'react-router-dom'
//import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';
import Popup from 'reactjs-popup';
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Details.css'
import PropTypes from 'prop-types';
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../CommonFunctions'
import Base64Downloader from 'react-base64-downloader';
import { Document } from 'react-pdf';
import base64 from 'base64topdf'


/*
except: LinksForDetails,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject
*/

//קומפוננטה המציגה פרטים של כל אוביקט
export class Details extends PureComponent {
    state = {
        dock: null
    }
    DocName = (docName) => {
        let name = docName.substring(docName.lastIndexOf('\\') + 1)
        return name.substring(0, name.lastIndexOf('.'));
    }
    DocksButtons = (docks) => {
        return docks.map((dock, index) => {
            const exten = dock.DocName.substring(dock.DocName.lastIndexOf('.'))
            if (exten.includes('png') || exten.includes('jpg'))
                return <Base64Downloader className="button-file" key={index}
                    base64={dock.DocCoding} downloadName={this.DocName(dock.DocName)}>
                    {this.DocName(dock.DocName)}
                </Base64Downloader>
            else if (exten.includes('pdf')) {
                return <button className="button-file" type='button' key={index}
                    onClick={() => { this.setState({ dock: <Document file={dock.DocCoding} /> }) }}>{this.DocName(dock.DocName)}</button>

            }
            else {
                return <button className="button-file" type='button' key={index}
                    onClick={() => { window.open(dock.DocCoding) }}>{this.DocName(dock.DocName)}</button>
            }
        })

    }
    render() {
        let i = 0, j = 0, k = 0, x
        const func = (index) => {//פונקציה שמחזירה את כל הקישורים,הלחצנים והשדות עבור האוביקט בשביל שדה מסוים
            let items = [];

            while (i < this.props.LinksPerObject.length && this.props.LinksPerObject[i].props.index === index) {

                items.push(this.props.LinksPerObject[i])
                i += 1
            }

            while (k < this.props.fieldsToAdd.length && this.props.fieldsToAdd[k].index === index) {
                items.push(<div><label >{this.props.fieldsToAdd[k].name}</label>:<label>{this.props.Object[this.props.fieldsToAdd[k].field]}</label></div>)
                k += 1
            }

            return items
        }
        const docks = this.props.docks ? DocButtons(this.props.docks(this.props.Object)) : []
        const dockF = 'מסמכים:'
        return (
            <div className="more-details">
                <Popup className="details-container" open={true} closeOnDocumentClick={false}
                    contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        // padding: "4rem",
                        position: "relative",
                        margin: "auto",
                        backgroundColor: "white",
                        // padding: "3rem 5rem",
                        border: "2px solid #d39e00",
                        direction: "rtl",
                        fontSize: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        lineHeight: "35px",
                        flexDirection: "column",

                    }} nested modal>
                    <a className="close" onClick={this.props.closeModal}>&times;</a>
                    <div className="div-container-popup">
                        {this.props.fieldsArray.map((item, index) => {

                            return <div className="more-details" key={index}>

                                {this.props.Object[item.field] && <div><label dir='rtl'>{item.name}</label>:

                  <label dir='rtl'>{this.props.Object[item.field]}</label></div>}
                                <span>
                                    {func(index).map(item => <div>{item}</div>)}
                                </span>

                            </div>
                        }
                        )}
                        {func('end').map(item =>
                            <div className="more-details">{item}</div>)}
                        {this.props.LinksForDetails ? this.props.LinksForDetails.map((link, index) => <div className="more-details-link" key={index}>{link}</div>) : null}
                        {this.props.ButtonsForEveryRow ? this.props.ButtonsForEveryRow.map((link, index) => <div><button onClick={link.onclick}>{link.name}</button><p /></div>) : null}
                        {docks.length > 0 && dockF} {docks}

                    </div>
                </Popup>
            </div>
        )
    }
}
Details.propTypes = {
    setForForm: PropTypes.func,
    fieldsArray: PropTypes.arrayOf(PropTypes.object),
    Object: PropTypes.object,
    closeModal: PropTypes.func,
    LinksPerObject: PropTypes.arrayOf(PropTypes.element),
    LinksForDetails: PropTypes.arrayOf(PropTypes.element),
    ButtonsForEveryRow: PropTypes.arrayOf(PropTypes.element),
    fieldsToAdd: PropTypes.arrayOf(PropTypes.object)
}
export default connect(mapStateToProps)(Details)
