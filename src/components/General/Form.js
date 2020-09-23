import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject,submit,name,type
*/
export class Form extends Component {

    state = {
        Object: { ...this.props.location.Object },
        isRedirect: false

    }
    componentDidMount = () => {
        let tempObject = { ...this.state.Object };
        if (Object.keys(tempObject).length === 0) {
            this.props.location.fieldsArray.map(field => { tempObject[field.field] = "" });
            tempObject[this.props.location.fieldsArray[0].field] = 1;
            this.props.location.fieldsToAdd.map(field => { tempObject[field.field] = "" });
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
            if (i < this.props.location.erors.length && this.props.location.erors[i].index === index) {
                i += 1
                return <label>{this.props.location.erors[i].name}</label>
            }
            return null
        }

        const func = (index) => {
            while (j < this.props.location.fieldsToAdd.length && this.props.location.fieldsToAdd[j].index === index) {
                j += 1
                return <div>
                    <label >{this.props.location.fieldsToAdd[j].name}</label>
                    <input type={this.props.location.fieldsToAdd[j].type} name={this.props.location.fieldsToAdd[j].field} value={this.state.Object[this.props.location.fieldsToAdd[j].field]} onChange={(e) => { this.change(e, this.props.location.fieldsToAdd[j].field) }} />
                </div>


            }
        }

        const submitHandler = (e) => {
            let re = null;
            e.preventDefault();

            this.setState({ isRedirect: this.props.location.submit(this.props.location.type, this.state.Object) })
        }
        return (
            <React.Fragment>

                <form onSubmit={submitHandler}>
                    {this.props.location.fieldsArray.map((field, index) =>
                        <span key={index}>
                            <label>{field.name}</label>
                            <input type={field.type} id={field.field} placeholder={field.name} value={this.state.Object[field.field]} onChange={(e) => { this.change(e, field.field) }} />
                            {puterors(index)}
                            {console.log('type', this.props.location.type)}
                            {this.props.location.type !== 'Search' && <br />}
                        </span>

                    )}
                    {this.props.location.fieldsToAdd.map((field, index) =>
                        <div key={index}>
                            <label>{field.name}</label>
                            <input type={field.type} id={field.field} name={field} value={this.state.Object[field.field]} onChange={(e) => { this.change(e, field) }} />
                            {puterors(index)}
                            {func(index)}

                            {this.props.location.type !== 'Search' && <br />}
                        </div>
                    )}
                    <button type={this.props.location.type} name={this.props.location.name} >{this.props.location.name}</button>

                </form>

                {console.log('isRedirect', this.state.isRedirect)}
                {this.state.isRedirect}
            </React.Fragment>

        )
    }
}


export default Form
