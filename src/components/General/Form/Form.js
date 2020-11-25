import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LabelInput from '../LabelInput/LabelInput'
//import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions'
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Popup from 'reactjs-popup';
import './Form.css';





/*
except: LinksForEveryRow,ButtonsForEveryRow,fieldsToAdd,fieldsArray,Object,LinksPerObject,submit,name,type
*/
//(קומפוננטת פורם לכל פורם שהוא (הוספת/עדכון אוביקט וכן לחיפוש
export class Form extends Component {
    setForForm = this.props.setForForm(this.props.Object);
    state = {//לכל קומפוננטה יש אוביקט, שדות שצריך להוסיף לו בהתאם לאוביקט, שגיאות אם הוקשמשהו לא חוקי, ושדה המציין אם הקומפוננטה סיימה את פעולתה וניתן לחזור להצגת האוביקטים
        Object: { ...this.props.Object },
        fieldsToAdd: this.setForForm.fieldsToAdd,
        fieldsArray: this.props.fieldsArray,
        LinksPerObject: this.setForForm.LinksPerObject,
        generalEror: '',
        erors: [],



    }
    componentDidMount = () => {
        // let tempObject = { ...this.state.Object };
        // if (Object.keys(tempObject).length === 0) {//אם האוביקט שנשלח, ריק, יש ליצור אוביקט חדש
        //     // this.state.fieldsArray.map(field => { tempObject[field.field] = "" });
        //     // //this.props.fieldsToAdd.map(field => { tempObject[field.field] = "" });
        //     // this.setState({ Object: tempObject });

        // }
        // else//אם לא יש להוסיף את השדות הנוספים בהתאם לאוביקט
        {
            const links = this.props.setForForm(this.state.Object)
            this.setState({ fieldsToAdd: links.fieldsToAdd, LinksPerObject: links.LinksPerObject });
        }

    }

    change = (e, field) => {//כשמשתנה שדה יש לעדכן זאת

        if (e) {
            if (!e.target) {
                if (e[0]) {
                    let tempObject = { ...this.state.Object };
                    tempObject[field] = e[0].id;
                    const links = this.props.setForForm(tempObject)

                    this.setState({ Object: tempObject, fieldsToAdd: links.fieldsToAdd, LinksPerObject: links.LinksPerObject })
                }

            }
            else {
                if (
                    e.target.type === 'file') {

                    if (e.target.files[0]) {
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

                    }
                }

                let tempObject = { ...this.state.Object };
                tempObject[field] = e.target.type === 'checkbox' ? e.target.checked :
                    e.target.type === 'radio' ? parseInt(e.target.value) : e.target.value;
                const links = this.props.setForForm(tempObject)
                this.setState({ Object: tempObject, fieldsToAdd: links.fieldsToAdd, LinksPerObject: links.LinksPerObject })
            }
        }
    }


    render() {

        let j = 0, i = 0;
        const func = (index) => {//פונקציה המרנדרת את השדות הנוספים
            let items = []
            const links = this.state.LinksPerObject
            while (i < links.length && links[i].props.index === index) {
                items.push(<span key={i}>{links[i]}<p /> {links[i].props.showForm}</span>)
                i += 1
            }
            return items
        }
        const fieldsToAdd = (index) => {
            let items = []

            let fieldsToAdd = this.state.fieldsToAdd[j]
            while (j < this.state.fieldsToAdd.length && fieldsToAdd.index === index) {
                fieldsToAdd = this.state.fieldsToAdd[j]
                items.push(<span className="span-container">
                    <br />
                    <LabelInput key={j} field={fieldsToAdd} content={this.state.Object[fieldsToAdd.field]} change={this.change} />
                </span>)
                j += 1
            }

            return items

        }

        const submitHandler = async (e) => {

            e.preventDefault();
            const val = this.props.validate(this.state.Object)
            if (val.isErr)
                this.setState({ generalEror: val.generalEror, erors: val.erors })
            else {
                //this.setState({ Redirect: this.props.submit(this.props.type, this.state.Object) })
                const res = await this.props.submit(this.props.type, this.state.Object)

                if (res !== null) {
                    debugger
                    this.props.closeModal();
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
            <div className="edit-container">
                <Popup className="popup-edit" open={true} closeOnDocumentClick={false}
                    contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        // padding: "4rem",
                        position: "relative",
                        margin: "auto",
                        backgroundColor: "white",
                        // padding: "0rem 5rem",
                        border: "2px solid #d39e00",
                        direction: "rtl",
                        fontSize: "16px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        lineHeight: "35px",
                        flexDirection: "column",

                    }} nested modal>

                    <a className="close" onClick={this.props.closeModal}>
                        &times;
              </a>
                    <div className="div-container-popup">
                        <form className={this.state.fieldsArray.length + this.state.fieldsToAdd.length > 11 ?
                            'form-edit margin-top-div' : 'form-edit'}
                            onSubmit={submitHandler}>
                            <p> <em>{this.state.generalEror}</em><br /></p>
                            {this.state.fieldsArray.map((field, index) =>
                                <>
                                    <span className="edit-span" key={index}>
                                        <LabelInput field={field} content={this.state.Object[field.field]} change={this.change} focusHandler={focusHandler} />
                                        {this.state.erors[field.field] && <><br /><em>{this.state.erors[field.field]}</em></>}

                                        {func(index)}
                                    </span>
                                    {fieldsToAdd(index)}
                                </>

                            )}

                            <div className="container-footer-edit"> {func('end')}</div>
                            <div className="container-footer-edit"> {fieldsToAdd('end')}</div>

                            {/* באטן של סבמיט */}
                            <button className="submit-edit" type='submit' name={this.props.name} >{this.props.name}</button>

                        </form>
                    </div>
                </Popup>
            </div>
        )
    }

}


export default connect(mapStateToProps)(Form);