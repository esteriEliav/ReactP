import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types';
import Select from "react-dropdown-select";
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './LabelInput.css'
//field,content,change

//קומפוננטה להצגת תווית ואינפוט מתאים
export class LabelInput extends PureComponent {

    render() {

        const type = this.props.field.type
        let content = this.props.content

        if (type === 'select') {
            content = this.props.field.selectOptions.find(i => i.id === content)
        }
        else if (type === 'date') {
            content = new Date(content).toLocaleDateString()
                .split('.').reverse()
                .map(i => i > 9 ? i : '0' + i)
                .join('-');
        }

        return (
            <span>
                <label dir='rtl'>{this.props.field.name}</label>
                <div className="radio-button-container">

                    {type === 'radio' ?
                        this.props.field.radioOptions.map((rad, ind) => {
                            return <React.Fragment key={ind}><input type='radio' name={this.props.field.name} id={rad.id} value={rad.id} required={this.props.field.required}
                                checked={content === rad.id}
                                onChange={(e) => {
                                    this.props.change(e, this.props.field.field);
                                }} />
                                {rad.name}</React.Fragment>
                        })
                        : type === 'checkbox' ? <input dir='rtl' type='checkbox' checked={content} onChange={(e) => { this.props.change(e, this.props.field.field) }} />
                            : type === 'select' ?
                                <Select dir='rtl' placeholder={this.props.field.name} options={this.props.field.selectOptions} labelField='name' valueField='id' searchBy='name' values={content ? [content] : []}
                                    onChange={(e) => { this.props.change(e, this.props.field.field); }} direction='rtl' noDataLabel='אין נתונים' required={this.props.field.required} />
                                : type === 'texterea' ? <textarea dir='rtl' placeholder={this.props.field.name} readOnly={this.props.field.readonly} required={this.props.field.required} value={content} onChange={(e) => { this.props.change(e, this.props.field.field) }} />
                                    : <input dir='rtl' type={type} id={this.props.field.field} pattern={this.props.field.pattern} placeholder={this.props.field.name} onFocus={this.props.focusHandler} readOnly={this.props.field.readonly} required={this.props.field.required}
                                        value={content ? content : ''} onChange={(e) => { this.props.change(e, this.props.field.field) }} dir='rtl' />

                    }

                </div>
            </span>
        )
    }
}
LabelInput.propTypes = {
    field: PropTypes.object,
    change: PropTypes.func,
    content: PropTypes.node
};
export default connect(mapStateToProps)(LabelInput)
