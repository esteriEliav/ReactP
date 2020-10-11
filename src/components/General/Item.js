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
        Object: [],
        LinksPerObject: [],
        isToomatch: false

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

    //
    /*
     
                    
     */
    render() {
        return (


            <React.Fragment>
                <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) return <td key={index}>{this.props.Object[item.field]}</td> })}

                    {this.state.LinksForEveryRow.map((lin, index) => <td><Link key={index} to={{/*בעבור כל שורה קישורים מתאימים */
                        pathname: lin.link, fieldsArray: this.props.fieldsArray, Object: lin.link === '/Form' ? this.props.Object : this.state.Object,
                        LinksForEveryRow: this.state.LinksForEveryRow, ButtonsForEveryRow: this.state.ButtonsForEveryRow,
                        fieldsToAdd: this.state.fieldsToAdd, LinksPerObject: this.state.LinksPerObject,
                        submit: this.props.submit, type: lin.type, name: lin.name,
                        setForForm: this.props.setForForm

                    }} >{lin.name} </Link></td>)}
                    {this.state.LinksPerObject.map((lin, index) => <span key={index}>{lin}  </span>)}{/*בעבור כל אוביקט קישורים מתאימים */}
                    {this.state.isToomatch && <td><Link to={{/*אם יש מידי הרבה שדות, קישור לפרטים מלאים */
                        pathname: '/Details', fieldsArray: this.props.fieldsArray, Object: this.state.Object,
                        LinksForEveryRow: this.state.LinksForEveryRow, ButtonsForEveryRow: this.state.ButtonsForEveryRow,
                        fieldsToAdd: this.state.fieldsToAdd, LinksPerObject: this.state.LinksPerObject,
                        submit: this.props.submit, setForForm: this.props.setForForm

                    }}>
                        לפרטים נוספים</Link> </td>}

                    {this.state.ButtonsForEveryRow.map((but, index) => <td><button key={index} onClick={() => but.onclick()}>{but.name}</button></td>)}{/*בעבור כל שורה באטנים מתאימים */}

                </tr>


            </React.Fragment>

        )
    }
}

export default Item
