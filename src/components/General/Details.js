import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';
import Popup from 'reactjs-popup';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import Form from './Form';

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
            console.log('object-det', this.state.object)
            while (i < this.props.LinksPerObject.length && this.props.LinksPerObject[i].props.index === index) {
                items.push(this.props.LinksPerObject[i])
                i += 1
            }

            while (k < this.props.fieldsToAdd.length && this.props.fieldsToAdd[k].index === index) {
                items.push(<div><label >{this.props.fieldsToAdd[k].name}</label><label>{this.props.Object[this.props.fieldsToAdd[k].field]}</label><p /></div>)
                k += 1
            }

            return items
        }

        return (
            <div>
                <Popup open={this.props.isOpen} closeOnDocumentClick={false}
                    contentStyle={{ backgroundColor: "gray" }} nested modal>
                    <a className="close" onClick={this.props.closeModal}>&times; </a>

                    {this.props.fieldsArray.map((item, index) =>

                        <div key={index}>

                            <label dir='rtl'>{item.name}</label>:

                  <label dir='rtl'>{this.props.Object[item.field]}</label>
                            <span>
                                {func(index).map(item => <div>{item}</div>)}
                            </span>

                        </div>

                    )}
                    {func('end').map(item =>
                        <div>{item}</div>)}
                    {this.props.LinksForEveryRow.map((link, index) => <div key={index}>{link}</div>)}
                    {this.props.ButtonsForEveryRow.map((link, index) => <div><button onClick={link.onclick}>{link.name}</button><p /></div>)}
                </Popup>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Details)
