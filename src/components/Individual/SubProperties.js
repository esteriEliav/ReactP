import React, { Component } from 'react'
import Table from "../General/Table";
import Form from '../General/Form'
import Properties from './Properties'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
import SubPropertyObject from '../../Models-Object/SubPropertyObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import Rentals from './Rentals';
//import { propertiesList } from './Properties';

/*
SubPropertyID int  not null identity,--קוד נכס בן
PropertyID int not null,--נכס אב
num int not null,
Size float null,--תוספת
RoomsNum float null,--תוספת
-- הוספת שדה מס תת דירה לתת נכסים

-- הוספת שדה האם מושכר לתת נכסים
IsRented bit not null constraint DF_SubProperties_IsRented default 0
*/


export class SubProperties extends Component {


    state = {
        name: 'תת נכסים',
        fieldsArray: [{ field: 'PropertyID', name: 'נכס', type: 'select', selectOptions: [] },
        { field: 'num', name: 'מספר', type: 'text', required: true }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsRented', name: 'מושכר?', type: 'checkbox' }],
        ObjectsArray: //this.props.location.objects
            [{ SubPropertyID: 1, PropertyID: 2, num: 2, Size: 150, RoomsNum: 2, IsRented: false }],//

        fieldsToSearch: [],//[{ field: 'PropertyID', name: 'קוד נכס', type: 'text' },
        // { field: 'num', name: 'מספר', type: 'text' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' }],
        isAutho: true,//false
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showSomthing: null,
        docks: [],
        propertyObject: {},
        rental: {}

    }
    componentDidMount = async () => {

        const cities = this.props.cities
        const propertiesOptions = this.props.propertiesList.map(async item => {
            const street = await postFunction('Property/GetStreetByID', item.CityID);
            if (street !== null)
                return { id: item.PropertyID, name: item.PropertyID + ':' + street.streetName + ' ' + item.Number + ' ' + cities.find(city => city.CityID === item.CityID).cityName }
        })
        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray[0].selectOptions = propertiesOptions;
        this.setState({ fieldsArray })

    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSonthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSonthing: null })
    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.RoomsNum && object.RoomsNum !== '' && !(parseFloat(object.RoomsNum).toString() === object.RoomsNum.toString())) {

            erors.RoomsNum = 'נא להקיש מספר'
            isErr = true
        }
        if (object.Size && object.Size !== '' && !(parseFloat(object.Size).toString() === object.Size.toString())) {
            erors.Size = 'נא להקיש מספר'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitSearch = (object) => {
        const path = 'SubProperty/Search';

        if (object) {
            let objects = Search(object, path)
            let name = 'תוצאות חיפוש'
            if (objects === null || objects === []) {
                objects = []
                name = 'לא נמצאו תוצאות'
            }
            this.setState({ objectsArray: objects, name })
        }
    }
    submit =async (type, object) => {
        let path = 'SubProperty/' + type + 'SubProperty'
        if (type === 'Add' || type === 'Update') {
            let newObj = SubPropertyObject()
            if (type === 'Add')
                newObj.SubPropertyID = 1
            else
                newObj.SubPropertyID = object.SubPropertyID
            newObj.PropertyID = object.PropertyID
            newObj.num = object.num
            newObj.IsRented = object.IsRented
            if (object.Size !== '')
                newObj.Size = parseFloat(object.Size)
            if (object.RoomsNum !== '')
                newObj.RoomsNum = parseFloat(object.RoomsNum)
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add
            }

            object = newObj

        }
        else if (type === 'Delete') {
            const con = window.confirm('למחוק תת נכס?')
            if (con === false)
                return;
            object = { id: object.SubPropertyID }
        }
        const res = await CommonFunctions(type, object, path)
        if (res && res !== null) {
            this.closeFormModal();
        }
    }


    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'תת נכסים')
            LinksForTable = [<button type='button' onClick={() => { this.setState({ ObjectsArray: this.props.SubPropertiesList, name: 'תת נכסים' }) }}>חזרה לתת נכסים</button>]
        return {
            LinksForTable

        }
    }
    setForForm = object => {
        let fieldsToAdd = [{ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }]
        const LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {

        let LinksForEveryRow = []
        let ButtonsForEveryRow = []
        let LinksPerObject = []
        let fieldsToAdd = []
        let tempobject = object;
        postFunction('Propety/GetPropertyByID', { id: object.PropertyID }).then(res => this.setState({ propertyObject: res }))
        object.PropertyID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Properties object={this.state.propertyObject} type='details'
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
        >{object.PropertyID}</Link>
        LinksPerObject.push(<button type='button' index={0} onClick={() => {
            this.setState({
                showForm: true, showSomthing:
                    <Properties type='form' formType='Update' formName='עריכה' object={this.state.propertyObject}
                        isOpen={this.state.showForm} closeModal={this.closeFormModal} />
            })
        }}  >ערוך נכס </button>)


        if (object.IsRented) {
            postFunction('Property/GetRentalBySubPropertyID', { id: object.SubPropertyID }).then(res => this.setState({ rental: res }))
            tempobject.IsRented = <Link onClick={() => {
                this.setState({
                    showDetails: true, showSomthing:
                        <Rentals object={this.state.rental} type='details'
                            isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
                })
            }}>v</Link>//שולח פרטי השכרה שמתקבלים מהפונקציה


            LinksPerObject.push(<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <Rentals type='form'
                            object={this.state.rental !== null ? this.state.rental : { PropertyID: object.PropertyID, SubPropertyID: object.SubPropertyID }}
                            formName={this.state.rental !== null ? 'הוסף' : 'עדכן'}
                            formType={this.state.rental !== null ? 'Update' : 'Add'}
                            isOpen={this.state.showForm} closeModal={this.closeFormModal} />
                })
            }} >שנה השכרה</button>)

        }
        postFunction('User/GetUserDocuments', { id: object.SubPropertyID, type: 5 }).then(res => this.setState({ docks: res }))
        if (this.state.docks && this.state.docks[0]) {
            fieldsToAdd.push({ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' })
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        }
        return {
            fieldsToAdd, LinksForEveryRow: LinksForEveryRow,
            ButtonsForEveryRow: ButtonsForEveryRow, enable: true,
            object: tempobject, LinksPerObject: []
        };
    }
    rend = () => {
        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            return <Details closeModal={this.closeDetailsModal} isOpen={this.state.showDetails}
                Object={this.props.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            />

        }
        else if (this.props.type === 'form') {

            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate} />
        }
        else
            return <div><Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
            />{this.state.showSomthing}</div>

    }
    render() {
        return (
            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/a' />}

            </div>
        )
    }

}

export default connect(mapStateToProps)(SubProperties);
//export const SubPropertiesList = [{ SubPropertyID: 1, PropertyID: 2, num: 2, Size: 150, RoomsNum: 2, IsRented: false }]
//GetFunction('SubProperty/GetAllSubProperties');
