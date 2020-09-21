import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


export class Form extends Component {
    state = {
        Object: { ...this.props.Object },


    }
    componentDidMount = () => {
        let tempObject = { ...this.state.Object }
        if (this.props.tempObject === null) {
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
            if (i < this.props.erors.length && this.props.erors[i].index == index) {
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
                <button>aaa</button>

                <form>
                    {this.props.fieldsArray.map((field, index) =>
                        <div>
                            <label>{field}</label>
                            <input type={field.field} name={field} value={this.state.Object[field.field]} onChange={(e) => { this.change(e, field.field) }} />
                            {puterors(index)}
                        </div>

                    )}
                    {this.props.fieldsToAdd.map((field, index) =>
                        <div>
                            <label>{field.name}</label>
                            <input type={this.props.fieldsInputTypes[index]} name={field} value={this.state.Object[field]} onChange={(e) => { this.change(e, field) }} />
                            {puterors(index)}
                            {func(index)}
                        </div>
                    )}
                    <button type="Submit" name={this.props.type}>{this.props.type}</button>
                </form>

            </React.Fragment>

        )
    }
}


export default Form
