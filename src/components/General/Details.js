import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Details extends Component {
    render() {
        let i = 0, j = 0, k = 0, x
        const func = (index) => {
            let items = [];
            {
                //console.log('i', this.props.i); console.log('j', this.props.j); console.log('k', this.props.k); console.log('index', index);
            }//
            while (i < this.props.LinksForEveryRow.length && this.props.LinksForEveryRow[i].index === index) {
                items.push(<Link to={this.props.LinksForEveryRow[i].link} Object={this.props.Object}>{this.props.LinksForEveryRow[i].name}</Link>)
                i += 1

            }
            while (j < this.props.ButtonsForEveryRow.length && this.props.ButtonsForEveryRow[j].index === index) {
                items.push(<button onClick={this.props.ButtonsForEveryRow[j].onclick}>{this.props.ButtonsForEveryRow[j].name}</button>)

                j += 1
            }
            while (k < this.props.fieldsToAdd.length && this.props.fieldsToAdd[k].index === index) {
                items.push(<div><label >{this.props.fieldsToAdd[k].name}</label><label>{this.props.Object[this.props.fieldsToAdd[k].field]}</label></div>)
                k += 1
            }
            return items
        }


        return (
            <div>
                {console.log('fieldsArray', this.props.fieldsArray),
                    console.log('object', this.props.Object)
                }
                {this.props.fieldsArray.map((item, index) =>

                    <div key={index}>

                        <label>{item.name}</label>:
                    <label>{this.props.Object[item.field]}</label>
                        <span>
                            {func(index).map(item => { return item })}


                        </span>

                    </div>

                )}
                {func('end').map(item => { return item })}
                {this.props.LinksPerObject.map((link, index) => <span key={index}>{link} </span>)}

            </div>
        )
    }
}

export default Details
