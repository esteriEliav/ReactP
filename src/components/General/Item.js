import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import Details from "./Details";

export class Item extends Component {
    state = {

        LinksForEveryRow: [],
        ButtonsForEveryRow: [],
        fieldsToAdd: [],
        Object: [],
        LinksPerObject: [],
        isToomatch: false

    }
    componentWillMount = () => {
        let gen = this.props.set(this.props.Object)
        this.setState({
            LinksForEveryRow: gen.LinksForEveryRow,
            ButtonsForEveryRow: gen.ButtonsForEveryRow,
            fieldsToAdd: gen.fieldsToAdd,
            Object: gen.object,
            LinksPerObject: gen.LinksPerObject
        });
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

                    {this.state.LinksForEveryRow.map((lin, index) => <td><Link key={index} to={{
                        pathname: lin.link, fieldsArray: this.props.fieldsArray, Object: this.state.Object,
                        LinksForEveryRow: this.state.LinksForEveryRow, ButtonsForEveryRow: this.state.ButtonsForEveryRow,
                        fieldsToAdd: this.state.fieldsToAdd, LinksPerObject: this.state.LinksPerObject,
                        erors: [], submit: this.props.submit, type: lin.type, name: lin.name

                    }} >{lin.name} </Link></td>)}
                    {this.state.LinksPerObject.map((lin, index) => <span key={index}>{lin}  </span>)}
                    {this.state.isToomatch && <td><Link to={{
                        pathname: '/Details', fieldsArray: this.props.fieldsArray, Object: this.state.Object,
                        LinksForEveryRow: this.state.LinksForEveryRow, ButtonsForEveryRow: this.state.ButtonsForEveryRow,
                        fieldsToAdd: this.state.fieldsToAdd, LinksPerObject: this.state.LinksPerObject,
                        submit: this.props.submit, erors: [],
                    }}>
                        לפרטים נוספים</Link> </td>}

                    {this.state.ButtonsForEveryRow.map((but, index) => <td><button key={index} onClick={() => but.onclick()}>{but.name}</button></td>)}

                </tr>


            </React.Fragment>

        )
    }
}

export default Item
