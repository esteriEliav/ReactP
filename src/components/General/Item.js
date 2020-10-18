import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Details from "./Details";

//קומפוננטה להצגת שורה בטבלה
export class Item extends Component {
    state = {
        LinksForEveryRow: [],
        ButtonsForEveryRow: [],
        fieldsToAdd: [],
        Object: {},
        LinksPerObject: [],
        isToomatch: false,
        details: false,
        form: false

    }
    closeDetailsModal = () => {

        this.setState({ details: false })
    }
    closeFormModal = () => {

        this.setState({ form: false })
    }
    componentWillMount = () => {//בעבורכל אוביקט יש לעדכן אותו ואת כל השדות והקישורים הקשורים אליו
        let gen = this.props.set(this.props.Object)
        this.setState({
            LinksForEveryRow: gen.LinksForEveryRow,
            ButtonsForEveryRow: gen.ButtonsForEveryRow,
            fieldsToAdd: gen.fieldsToAdd,
            Object: gen.object,
            LinksPerObject: gen.LinksPerObject
        });
        //אם יש מידי הרבה שדות , לא נציג את כולם ונוסיף קישור לפרטים מלאים
        if (this.props.fieldsArray.length > 5 || this.props.fieldsArray.length + this.state.LinksForEveryRow.length + this.state.ButtonsForEveryRow.length + this.state.fieldsToAdd.length > 8)
            this.setState({ isToomatch: true })
    }

    showdet = () => {


        return this.state.details && <Details closeModal={this.closeDetailsModal} isOpen={this.state.details}
            fieldsArray={this.props.fieldsArray} Object={this.state.Object}
            LinksForEveryRow={this.state.LinksForEveryRow} ButtonsForEveryRow={this.state.ButtonsForEveryRow}
            fieldsToAdd={this.state.fieldsToAdd} LinksPerObject={this.state.LinksPerObject}
            submit={this.props.submit} setForForm={this.props.setForForm}
        />
    }
    showForm = (link, type, name) => {
        return <Form closeModal={this.closeFormModal} isOpen={this.state.form}
            fieldsArray={this.props.fieldsArray} Object={link === '/Form' ? this.props.Object : this.state.Object}
            LinksForEveryRow={this.state.LinksForEveryRow} ButtonsForEveryRow={this.state.ButtonsForEveryRow}
            fieldsToAdd={this.state.fieldsToAdd} LinksPerObject={this.state.LinksPerObject}
            submit={this.props.submit} type={type} name={name}
            setForForm={this.props.setForForm}
        />
    }
    //
    /*
     
                    
     */
    render() {
        return (


            <React.Fragment>
                <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) return <td key={index}>{this.props.Object[item.field]}</td> })}

                    {this.state.LinksForEveryRow.map((lin, index) => <td><button key={index} onClick={() => { this.setState({ form: true }) }}
                    >{lin.name} </button>
                        {this.showForm(lin.link, lin.type, lin.name)}
                    </td>
                    )}

                    {/* {this.state.LinksPerObject.map((lin, index) => <span key={index}>{lin}  </span>)}בעבור כל אוביקט קישורים מתאימים */}
                    <td><button onClick={() => { this.setState({ details: true }) }} >
                        לפרטים נוספים</button> </td>
                    {this.showdet()}

                    {this.state.ButtonsForEveryRow.map((but, index) => <td><button key={index} onClick={() => but.onclick(but.type, this.state.Object)}>{but.name}</button></td>)}{/*בעבור כל שורה באטנים מתאימים */}


                </tr>


            </React.Fragment>

        )
    }
}

export default Item
