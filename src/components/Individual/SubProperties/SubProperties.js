import React, { Component, PureComponent } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Details from '../../General/Details/Details';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Rental from '../Rentals/Rental';
import { DocButtons, DocDeleteButton, DocField, AddDocField, toPropertiesOptions } from '../../General/CommonFunctions'
import Property from '../Properties/Property';
import * as Action from '../../General/Action'
import SubPropertyForm from './SubPropertyForm'
import SubPropertyTable from './SubPropertyTable'


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


export class SubProperties extends PureComponent {

    state = {
        fieldsArray: [{ field: 'PropertyID', name: 'נכס', type: 'select', selectOptions: [] },
        { field: 'num', name: 'מספר', type: 'text', required: true }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsRented', name: 'מושכר?', type: 'checkbox' }],
        showSomthing: null,
        red: null
    }
    comp = () => {
        const propertiesOptions = toPropertiesOptions(this.props.propertiesList.filter(item => item.IsDivided), this.props.cities, this.props.streets)
        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray.find(i => i.field === 'PropertyID').selectOptions = propertiesOptions;
        this.setState({ fieldsArray })
    }
    componentDidMount = () => {
        this.comp()
    }
    componentDidUpdate = (prevProps) => {
        if (JSON.stringify(prevProps.propertiesList) !== JSON.stringify(this.props.propertiesList)) {
            this.comp()
        }

    }
    showModal = (show) => {

        this.setState({ showSomthing: show })
    }
    closeModal = () => {

        this.setState({ showSomthing: null })
    }
    UpdateAfterAction = async (res) => {
        let list = await GetFunction('SubProperty/GetAllSubProperties')
        this.props.setSubProperties(list !== null ? list : [])

        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/SubProperties' }} /> })
        return res
    }
    set = (object) => {

        let ButtonsForEveryRow = []
        let LinksPerObject = []
        let fieldsToAdd = []
        let tempobject = { ...object };
        const propertyObject = this.props.propertiesList.find(i => i.PropertyID === object.PropertyID)
        tempobject.PropertyID = <Link onClick={() => {
            this.setState({
                showSomthing: <Property
                    type={Action.details}
                    object={propertyObject}
                    closeModal={this.closeModal} />
            })
        }}
        >{object.PropertyID}</Link>
        LinksPerObject.push(<button type='button' index={0} onClick={() => {
            this.setState({
                showSomthing:
                    <Property
                        type={Action.form}
                        formType={Action.Update}
                        object={propertyObject}
                        closeModal={this.closeModal} />
            })
        }}  >ערוך נכס </button>)
        if (object.IsRented) {
            const rental = this.props.rentalsList.find(i => i.SubPropertyID === object.SubPropertyID)
            tempobject.IsRented = <Link onClick={() => {
                this.setState({
                    showSomthing:
                        <Rental
                            object={rental}
                            type={Action.details}
                            closeModal={this.closeModal} />
                })
            }}>v</Link>//שולח פרטי השכרה שמתקבלים מהפונקציה
            LinksPerObject.push(<button type='button' onClick={() => {
                this.setState({
                    showSomthing:
                        <Rental
                            type={Action.form}
                            object={rental !== null ? this.state.rental : { PropertyID: object.PropertyID, SubPropertyID: object.SubPropertyID }}
                            formName={rental !== null ? 'הוסף' : 'עדכן'}
                            formType={rental !== null ? Action.Update : Action.Add}
                            closeModal={this.closeModal} />
                })
            }} >שנה השכרה</button>)

        }
        return {
            fieldsToAdd, ButtonsForEveryRow, object: tempobject, LinksPerObject
        };
    }
    docks = object => {
        return this.props.documents.filter(i => i.type === 5 && i.DocUser === object.SubPropertyID)
    }
    rend = () => {
        let whatToRender = []
        if (this.props.type === Action.details) {
            const some = this.set(this.props.object)
            whatToRender.push(<Details
                closeModal={this.props.closeModal}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
                docks={this.docks}
            />)
        }
        else if (this.props.type === Action.form) {
            whatToRender.push(<SubPropertyForm
                {...this.props}
                closeFormModal={this.props.closeModal}
                object={this.props.object}
                formName={this.props.formName}
                formType={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                UpdateAfterAction={this.UpdateAfterAction}
                showModal={this.showModal}
                closeModal={this.closeModal}
                docks={this.docks}
            />)
        }
        else {
            whatToRender.push(
                <SubPropertyTable
                    {...this.props}
                    fieldsArray={this.state.fieldsArray}
                    set={this.set}
                    delObject={this.delObject}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    UpdateAfterAction={this.UpdateAfterAction}
                    objectsArray={this.props.location && this.props.location.objects}
                    PropertyID={this.props.location.PropertyID}
                />

            )
        }
        whatToRender.push(this.state.showSomthing, this.state.red)
        return whatToRender
    }
    render() {
        return (
            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/' />}
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SubProperties);
