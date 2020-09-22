import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


export class Form extends Component {
    state = {
        Object: { ...this.props.Object },


    }
    componentDidMount = () => {
        let tempObject = { ...this.state.Object }
        if (tempObject === null) {
            this.props.fieldArray.map(field => { tempObject[field] = "" });
            tempObject[this.props.fieldArray[0]] = this.props.length + 1;
            this.setState({ Object: tempObject });
            console.log('object', this.state.Object)
        }
    }
    change = (e, field) => {

        let tempObject = { ...this.state.Object };
        tempObject[field] = e.target.value;
        this.setState({ Object: tempObject })

    }
    render() {

        let i = 0, j = 0;
        const puterors = (index) => {
            if (i < this.props.erors.length && this.props.erors[i].index === index) {
                i += 1
                return <label>{this.props.erors[i].name}</label>
            }
            return null
        }

        const func = (index) => {
            while (j < this.props.fieldsToAdd.length && this.props.fieldsToAdd[j].index === index) {
                j += 1
                return <div>
                    <label >{this.props.fieldsToAdd[j].name}</label>
                    <input type={this.props.fieldsToAdd[j].type} name={this.props.fieldsToAdd[j].field} value={this.state.Object[this.props.fieldsToAdd[j].field]} onChange={(e) => { this.change(e, this.props.fieldsToAdd[j].field) }} />
                </div>


            }
        }
        return (
            <React.Fragment>

                <form onSubmit={() => this.props.submit(this.props.type, this.state.Object)}>
                    {this.props.fieldsArray.map((field, index) =>
                        <span key={index}>
                            <label>{field.name}</label>
                            <input type={field.type} id={field.field} placeholder={field.name} value={this.state.Object[field.field]} onChange={(e) => { this.change(e, field.field) }} />
                            {puterors(index)}
                            {this.props.type !== 'Search' && <br />}
                        </span>

                    )}
                    {this.props.fieldsToAdd.map((field, index) =>
                        <div key={index}>
                            <label>{field.name}</label>
                            <input type={field.type} id={field.field} name={field} value={this.state.Object[field.field]} onChange={(e) => { this.change(e, field) }} />
                            {puterors(index)}
                            {func(index)}
                        </div>
                    )}
                    <button type={this.props.type} name={this.props.name} >{this.props.name}</button>
                </form>

            </React.Fragment>

        )
    }
}


export default Form
