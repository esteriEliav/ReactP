import React, { Component } from 'react'
import Select from "react-dropdown-select";
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
//field,content,change

//קומפוננטה להצגת תווית ואינפוט מתאים
export class LabelInput extends Component {

    render() {
        const type = this.props.field.type
        let content = this.props.content
        if (type === 'date') {
            content = new Date(content).toLocaleDateString()
                .split('.').reverse()
                .map(i => i > 9 ? i : '0' + i)
                .join('-');
        }
        return (
            <span>

                {type === 'radio' ?
                     this.props.field.radioOptions.map((rad, ind) => <div key={ind}><input type='radio' name={this.props.field.name} id={rad.id} value={rad.id}
                       checked={content === rad.id} onChange={(e) => { this.props.change(e, this.props.field.field) }} />{rad.name}</div>) 
                    : type === 'checkbox' ? <input dir='rtl' type='checkbox' checked={content} onChange={(e) => { this.props.change(e, this.props.field.field) }} />
                        : type === 'select' ? 
                        // <Select dir='rtl' placeholder={this.props.field.name} options={this.props.field.selectOptions} labelField='name' valueField='id' onChange={(e) => { this.props.change(e, this.props.field.field) }} direction='rtl' noDataLabel='אין נתונים' />
                            <select value={content} onChange={(e) => { this.props.change(e, this.props.field.field)  }} direction='rtl' noDataLabel='אין נתונים' >
                                 {this.props.field.selectOptions.map(opp => <option key={opp.id} value={opp.id}>{opp.name}</option>)}
                            </select>
                            : type === 'texterea' ? <textarea dir='rtl' placeholder={this.props.field.name} readOnly={this.props.field.readonly} required={this.props.field.required} value={content} onChange={(e) => { this.props.change(e, this.props.field.field) }} />
                                : <input dir='rtl' type={type} id={this.props.field.field} pattern={this.props.field.pattern} placeholder={this.props.field.name} onFocus={this.props.focusHandler} readOnly={this.props.field.readonly} required={this.props.field.required}
                                    value={content} onChange={(e) => { this.props.change(e, this.props.field.field) }} dir='rtl' />

                }
                <label dir='rtl'>{this.props.field.name}</label>
            </span>
        )
    }
}

export default connect(mapStateToProps)(LabelInput)
