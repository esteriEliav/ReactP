import React, { Component } from 'react'
import { Link } from 'react-router-dom'
//import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';
import Popup from 'reactjs-popup';
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Details.css'

/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject
*/

//קומפוננטה המציגה פרטים של כל אוביקט
export class Details extends Component {
    state = {
        showForm: false,
        object: this.props.Object
    }
    closeModal = () => {
        this.setState({ showForm: false })
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
                            debugger
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
                        {this.props.LinksForEveryRow.map((link, index) => <div className="more-details-link" key={index}>{link}</div>)}
                        {this.props.ButtonsForEveryRow.map((link, index) => <div><button onClick={link.onclick}>{link.name}</button><p /></div>)}
                    </div>
                </Popup>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Details)
