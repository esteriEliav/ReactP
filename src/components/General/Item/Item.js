import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Form from '../Form';
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Details from "../Details";
import './Item.css';
// import MoreDetails from './';
// import Edit from './';
// import Delete from './'



//קומפוננטה להצגת שורה בטבלה
export class Item extends Component {
    gen = this.props.set(this.props.Object);
    state = {
        LinksForEveryRow: this.gen.LinksForEveryRow,
        ButtonsForEveryRow: this.gen.ButtonsForEveryRow,
        fieldsToAdd: this.gen.fieldsToAdd,
        LinksPerObject: this.gen.LinksPerObject,
        Object: this.gen.object,
        // isToomatch: false,
        details: false,
        form: false

    }

    closeDetailsModal = () => {

        this.setState({ details: false })
    }
    closeFormModal = () => {

        this.setState({ form: false })
    }
    // componentWillMount = () => {//בעבורכל אוביקט יש לעדכן אותו ואת כל השדות והקישורים הקשורים אליו
    //     //אם יש מידי הרבה שדות , לא נציג את כולם ונוסיף קישור לפרטים מלאים
    //     if (this.props.fieldsArray.length > 5 || this.props.fieldsArray.length + this.state.LinksForEveryRow.length + this.state.ButtonsForEveryRow.length + this.state.fieldsToAdd.length > 8)
    //         this.setState({ isToomatch: true })
    // }

    showdet = () => {
        return this.state.details && <Details closeModal={this.closeDetailsModal} isOpen={this.state.details}
            fieldsArray={this.props.fieldsArray} Object={this.state.Object}
            LinksForEveryRow={this.state.LinksForEveryRow} ButtonsForEveryRow={this.state.ButtonsForEveryRow}
            fieldsToAdd={this.state.fieldsToAdd} LinksPerObject={this.state.LinksPerObject}
            submit={this.props.submit} setForForm={this.props.setForForm}
        />
    }
    showForm = (type, name) => {
        return this.state.form && <Form closeModal={this.closeFormModal} isOpen={this.state.form}
            fieldsArray={this.props.fieldsArray} Object={this.props.Object}
            submit={this.props.submit} type={type} formType={type} name={name}
            setForForm={this.props.setForForm} validate={this.props.validate}
        />

    }
    render() {
        return (
            <React.Fragment>
                <tr>{this.props.fieldsArray.map((item, index) => {if (index < 6) return <td key={index}>{this.state.Object[item.field]}</td> })}
                    {(this.props.user.RoleID == 1 || this.props.user.RoleID == 2) &&
                        <div className="icon-container">
                            <td><button onClick={() => { this.setState({ details: true }) }} >
                            &#10011;
                             </button>{this.showdet()}</td>

                            <td><button onClick={() => { this.setState({ form: true }) }} > 
                            &#128394;
                            </button>{this.showForm("Update", 'ערוך')} </td>

                            <td><button onClick={() => { this.props.submit('Delete', this.props.Object) }}>
                            {/* &#10008; */}
                            &#128465;
                            </button></td>
                        </div>
                    }
                    {this.state.ButtonsForEveryRow.map((but, index) => <td index={index}> {but}</td>)}
                </tr>


            </React.Fragment>

        )
    }
}
export default connect(mapStateToProps)(Item)
