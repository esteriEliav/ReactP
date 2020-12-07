import React, { Component, PureComponent } from 'react'
import LabelInput from './LabelInput/LabelInput'
import { SearchFor } from './CommonAxiosFunctions'
import { mapStateToProps } from '../Login/Login'
import { connect } from 'react-redux';
import '../../components/Individual/Task/Task.css'

export class Search extends PureComponent {

    state = {//לכל קומפוננטה יש אוביקט, שדות שצריך להוסיף לו בהתאם לאוביקט, שגיאות אם הוקשמשהו לא חוקי, ושדה המציין אם הקומפוננטה סיימה את פעולתה וניתן לחזור להצגת האוביקטים
        Object: { ...this.props.Object },
        isRedirect: false,
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.statusSearch == false && this.props.statusSearch === true) {

            this.setState({ Object: {} })
        }
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
    submitHandler = async (e) => {
        e.preventDefault();
        if (this.state.Object) {
            const path = this.props.path + '/Search';
            let objects = await SearchFor(this.state.Object, path)
            this.props.submit(objects)

        }
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
                    <button type={this.props.type}>חיפוש</button>
                </form>
            </div>
        )
    }

}
export default connect(mapStateToProps)(Search);
