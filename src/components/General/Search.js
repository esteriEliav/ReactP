import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LabelInput from './LabelInput/LabelInput'
//import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions'
import Popup from 'reactjs-popup';
import { mapStateToProps } from '../Login/Login'
import { connect } from 'react-redux';
import '../../components/Individual/Task/Task.css'

export class Search extends Component {

    state = {//לכל קומפוננטה יש אוביקט, שדות שצריך להוסיף לו בהתאם לאוביקט, שגיאות אם הוקשמשהו לא חוקי, ושדה המציין אם הקומפוננטה סיימה את פעולתה וניתן לחזור להצגת האוביקטים
        Object: { ...this.props.Object },
        isRedirect: false,
    }
    componentDidMount = () => {
        // let tempObject = {}
        // this.props.fieldsArray.map(field => { tempObject[field.field] = "" });
        // this.setState({ Object: tempObject });

    }
    change = (e, field) => {//כשמשתנה שדה יש לעדכן זאת
        let tempObject = { ...this.state.Object };
        if (e.target.type === 'checkbox')
            tempObject[field] = e.target.checked
        else if (e.target.type === 'radio') {
            if (parseInt(e.target.value))
                tempObject[field] = parseInt(e.target.value)
            else
                tempObject[field] = e.target.value;
        }
        else
            tempObject[field] = e.target.value;

        this.setState({ Object: tempObject });
    }
    submitHandler = (e) => {
        e.preventDefault();
        this.props.submit(this.state.Object)

        // this.setState({ isRedirect: this.props.submit(this.state.Object) })
    }

    render() {

        return (
            <div>
                <form className="Form-container" onSubmit={this.submitHandler}>
                    {this.props.fieldsArray.map((field, index) =>
                        <span key={index}>
                            <LabelInput field={field} content={this.state.Object[field.field]} change={this.change} />
                        </span>

                    )}
                    {/* באטן של סבמיט */}
                    <button type={this.props.type} name={this.props.name} >{this.props.name}</button>
                </form>
                {/* {this.state.isRedirect} */}
            </div>
        )
    }

}
export default connect(mapStateToProps)(Search);
