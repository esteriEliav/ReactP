import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';
import Popup from 'reactjs-popup';
import Form from './Form';

/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject
*/

//קומפוננטה המציגה פרטים של כל אוביקט
export class Details extends Component {
    state = {
        showForm: false
    }
    closeModal = () => {
        this.setState({ showForm: false })
    }
    render() {
        let i = 0, j = 0, k = 0, x
        const func = (index) => {//פונקציה שמחזירה את כל הקישורים,הלחצנים והשדות עבור האוביקט בשביל שדה מסוים
            let items = [];
            {
                //console.log('i', this.props.i); console.log('j', this.props.j); console.log('k', this.props.k); console.log('index', index);
            }//
            while (i < this.props.LinksForEveryRow.length && this.props.LinksForEveryRow[i].index === index) {
                items.push(<button onclick={() => { this.setState({ showForm: true }); debugger; }} showForm={() => {
                    debugger;
                    return <Form
                        type={index === 'end' ? 'end' : this.props.LinksForEveryRow[i - 1].type}
                        Object={this.props.Object}
                        fieldsArray={this.props.fieldsArray} erors={[]} submit={this.props.submit} type='Update' name='ערוך'
                        LinksForEveryRow={this.props.LinksForEveryRow} ButtonsForEveryRow={this.props.ButtonsForEveryRow}
                        fieldsToAdd={this.props.fieldsToAdd} setForForm={this.props.setForForm} />
                }}>
                    {this.props.LinksForEveryRow[i].name}</button>)
                i += 1

            }
            while (j < this.props.ButtonsForEveryRow.length && this.props.ButtonsForEveryRow[j].index === index) {
                items.push(<div><button onClick={this.props.ButtonsForEveryRow[j].onclick}>{this.props.ButtonsForEveryRow[j].name}</button><p /></div>)

                j += 1
            }
            while (k < this.props.fieldsToAdd.length && this.props.fieldsToAdd[k].index === index) {
                items.push(<div><label >{this.props.fieldsToAdd[k].name}</label><label>{this.props.Object[this.props.fieldsToAdd[k].field]}</label><p /></div>)
                k += 1
            }

            return items
        }

        return (
            <div>
                <Popup open={this.props.isOpen} closeOnDocumentClick={false} contentStyle={{ backgroundColor: "gray" }}>
                    <a className="close" onClick={this.props.closeModal}>&times; </a>



                    {this.props.fieldsArray.map((item, index) =>

                        <div key={index}>

                            <label dir='rtl'>{item.name}</label>:

                  <label dir='rtl'>{this.props.Object[item.field]}</label>
                            <span>
                                {func(index).map(item => {
                                    return <div>{item}
                                        {item.props.showForm && item.props.showForm()}
                                    </div>
                                })}


                            </span>
                            <p /><p />
                        </div>

                    )}
                    {func('end').map(item => {
                        return <div>{item}
                            {item.props.showForm && item.props.showForm()}

                        </div>
                    })}
                    {this.props.LinksPerObject.map((link, index) => <span key={index}>{link}<p /> </span>)}
                </Popup>
            </div>
        )
    }
}

export default Details
