import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LabelInput from './LabelInput'

import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions'






/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject,submit,name,type
*/
//(קומפוננטת פורם לכל פורם שהוא (הוספת/עדכון אוביקט וכן לחיפוש
export class Form extends Component {

    state = {//לכל קומפוננטה יש אוביקט, שדות שצריך להוסיף לו בהתאם לאוביקט, שגיאות אם הוקשמשהו לא חוקי, ושדה המציין אם הקומפוננטה סיימה את פעולתה וניתן לחזור להצגת האוביקטים
        Object: { ...this.props.location.Object },
        fieldsToAdd: [],
        isRedirect: false,
        generalEror: '',
        erors: {},
        selectedFile: {}

    }
    componentDidMount = () => {
        let tempObject = { ...this.state.Object };
        if (Object.keys(tempObject).length === 0) {//אם האוביקט שנשלח, ריק, יש ליצור אוביקט חדש
            this.props.location.fieldsArray.map(field => { tempObject[field.field] = "" });
            //this.props.location.fieldsToAdd.map(field => { tempObject[field.field] = "" });
            this.setState({ Object: tempObject });

        }
        else//אם לא יש להוסיף את השדות הנוספים בהתאם לאוביקט
            this.setState({ fieldsToAdd: this.props.location.setForForm(this.state.Object) });


    }
    change = (e, field) => {//כשמשתנה שדה יש לעדכן זאת

        if (e.target.type === 'file') {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = (fr) => {
                console.log('data', reader.result)
                let obj = { ...this.state.Object }
                obj.add = new String(reader.result)
                this.setState({ Object: obj })
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
            this.setState({
                selectedFile: e.target
            })

        }

        let tempObject = { ...this.state.Object };
        tempObject[field] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;



        this.setState({ Object: tempObject, fieldsToAdd: this.props.location.setForForm(tempObject) })

    }

    render() {

        let j = 0;


        const func = (index) => {//פונקציה המרנדרת את השדות הנוספים
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

            e.preventDefault();
            let isStop = false
            if (this.props.location.type !== 'Search') {
                const val = this.props.location.validate(this.state.Object)
                isStop = val.isErr
                if (isStop)
                    this.setState({ generalEror: val.generalEror, erors: val.erors })

                if (!isStop) {
                    debugger
                    // let obj = { ...this.state.Object }
                    // obj.document = obj.add
                    // this.setState({ Object: obj })

                    this.setState({ isRedirect: this.props.location.submit(this.props.location.type, this.state.Object) })

                }
            }
        }
        const focusHandler = (e) => {//כשמתמקדים על שדה אם אינו ניתן לעריכה, תוצג הודעה
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
                            {this.props.location.type !== 'Search' && <p />}{/* אם לא מדובר בפורם לחיפוש יש לרווח בין האינפוטים */}
                        </span>

                    )}
                    {func('end')}
                    {this.props.location.type !== 'Search' && <p />}
                    {/* באטן של סבמיט */}
                    <button type={this.props.location.type} name={this.props.location.name} >{this.props.location.name}</button>

                </form>

                { this.state.isRedirect}
            </React.Fragment>

        )
    }
}


export default Form
