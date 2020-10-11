import React, { Component } from 'react'
import { Link } from 'react-router-dom'
/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject
*/

//קומפוננטה המציגה פרטים של כל אוביקט
export class Details extends Component {
    render() {
        let i = 0, j = 0, k = 0, x
        const func = (index) => {//פונקציה שמחזירה את כל הקישורים,הלחצנים והשדות עבור האוביקט בשביל שדה מסוים
            let items = [];
            {
                //console.log('i', this.props.location.i); console.log('j', this.props.location.j); console.log('k', this.props.location.k); console.log('index', index);
            }//
            while (i < this.props.location.LinksForEveryRow.length && this.props.location.LinksForEveryRow[i].index === index) {
                items.push(<Link to={{
                    pathname: this.props.location.LinksForEveryRow[i].link, type: this.props.location.LinksForEveryRow[i].type,
                    Object: this.props.location.Object,
                    fieldsArray: this.props.location.fieldsArray, erors: [], submit: this.props.location.submit, type: 'Update', name: 'ערוך',
                    LinksForEveryRow: this.props.location.LinksForEveryRow, ButtonsForEveryRow: this.props.location.ButtonsForEveryRow,
                    fieldsToAdd: this.props.location.fieldsToAdd, setForForm: this.props.setForForm

                }}>
                    {this.props.location.LinksForEveryRow[i].name}</Link>)
                i += 1

            }
            while (j < this.props.location.ButtonsForEveryRow.length && this.props.location.ButtonsForEveryRow[j].index === index) {
                items.push(<button onClick={this.props.location.ButtonsForEveryRow[j].onclick}>{this.props.location.ButtonsForEveryRow[j].name}</button>)

                j += 1
            }
            while (k < this.props.location.fieldsToAdd.length && this.props.location.fieldsToAdd[k].index === index) {
                items.push(<div><label >{this.props.location.fieldsToAdd[k].name}</label><label>{this.props.location.Object[this.props.location.fieldsToAdd[k].field]}</label></div>)
                k += 1
            }
            return items
        }


        return (
            <div>

                {this.props.location.fieldsArray.map((item, index) =>

                    <div key={index}>

                        <label>{item.name}</label>:
                    <label>{this.props.location.Object[item.field]}</label>
                        <span>
                            {func(index).map(item => { return item })}
                        </span>

                    </div>

                )}
                {func('end').map(item => { return item })}
                {this.props.location.LinksPerObject.map((link, index) => <span key={index}>{link} </span>)}

            </div>
        )
    }
}

export default Details
