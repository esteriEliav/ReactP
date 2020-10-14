import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LabelInput from './LabelInput'

/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject,submit,name,type
*/
export class Form extends Component {

    state = {
        Object: { ...this.props.location.Object },
        fieldsToAdd: [],
        isRedirect: false,
        generalEror: '',
        erors: {}

    }
    componentDidMount = () => {
        let tempObject = { ...this.state.Object };
        if (Object.keys(tempObject).length === 0) {
            this.props.location.fieldsArray.map(field => { tempObject[field.field] = "" });
            //this.props.location.fieldsToAdd.map(field => { tempObject[field.field] = "" });
            this.setState({ Object: tempObject });

        }
        else
            this.setState({ fieldsToAdd: this.props.location.setForForm(this.state.Object) });


    }
    change = (e, field) => {

        let tempObject = { ...this.state.Object };
        tempObject[field] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        this.setState({ Object: tempObject, fieldsToAdd: this.props.location.setForForm(tempObject) })

    }
    render() {

        let j = 0;


        const func = (index) => {
            const fieldsToAdd = this.state.fieldsToAdd[j]
            while (j < this.state.fieldsToAdd.length && fieldsToAdd.index === index) {
                j += 1
                return <span>
                    <p />
                    <LabelInput field={fieldsToAdd} content={this.state.Object[fieldsToAdd.field]} change={this.change} />

                </span>


            }
        }

        const submitHandler = (e) => {
            debugger;
            e.preventDefault();
            const val = this.props.location.validate(this.state.Object)
            if (val.isErr)
                this.setState({ generalEror: val.generalEror, erors: val.erors })
            else
                this.setState({ isRedirect: this.props.location.submit(this.props.location.type, this.state.Object) })
        }
        const focusHandler = (e) => {
            console.log(e.target.value)
            if (e.target.readOnly) {
                let erors = { ...this.state.erors }
                erors[e.target.id] = 'אין אפשרות לערוך שדה זה'
                console.log('e.target.id', e.target.id)
                this.setState({ erors })
            }
        }
        return (
            <React.Fragment>

                <form onSubmit={submitHandler}>
                    <p> <em>{this.state.generalEror}</em><br /></p>

                    {console.log('generalEror', this.state.generalEror)}
                    {this.props.location.fieldsArray.map((field, index) =>
                        <span key={index}>
                            <LabelInput field={field} content={this.state.Object[field.field]} change={this.change} focusHandler={focusHandler} />
                            {this.state.erors[field.field] && <><br /><em>{this.state.erors[field.field]}</em></>}
                            {func(index)}
                            {this.props.location.type !== 'Search' && <p />}
                        </span>

                    )}
                    <button type={this.props.location.type} name={this.props.location.name} >{this.props.location.name}</button>

                </form>

                { this.state.isRedirect}
            </React.Fragment>

        )
    }
}


export default Form
