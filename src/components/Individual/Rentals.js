import React, { Component } from 'react'
import Table from '../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../Axios";
import Details from '../General/Details';
import Renter, { rentersList } from './Renter';
import Properties, { propertiesList } from './Properties';
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
import RentalObject from '../../Models-Object/RentalObject';
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import Form from '../General/Form'
import { PropertyOwner } from './PropertyOwner';
import { SubProperties } from './SubProperties';


/*
RentalID int  not null identity,
PropertyID int not null,
SubPropertyID int,
UserID int,--שוכר
RentPayment float,
PaymentTypeID int,
EnteryDate datetime,--תאריך תחילת חוזה
EndDate datetime,--תאריך סיום
ContactRenew bit constraint DF_Rentals_ContactRenew default 0,--האם לחדש חוזה
*/
export class Rentals extends Component {
    obj = []
    componentDidMount = () => {

        Axios.get('Rental/GetAllRentals').then(res => {
            this.obj = res.data

            console.log('res.data', res.data)
        }, res => { console.log('res.data', res) })
        console.log('obj', this.obj)
    }

    PaymentTypeOptions = GetFunction('Rental/GetAllPaymentTypes')
    renters = rentersList.map(item => { return { id: item.OwnerID, name: item.FirstName + ' ' + item.LastName } })
    cities = GetFunction('Property/GetAllCities')
    propertiesOptions = propertiesList.map(item => { const street = postFunction('Property/GetStreetByID', item.CityID); return { id: item.PropertyID, name: item.PropertyID + ':' + street.streetName + ' ' + item.Number + ' ' + this.cities.find(city => city.CityID === item.CityID).cityName } })
    state = {
        name: 'השכרות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'select', selectOptions: this.propertiesOptions }, { field: 'UserID', name: 'שוכר', type: 'select', selectOptions: this.renters },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio', radioOptions: this.PaymentTypeOptions, required: true }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }, , { field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'UserID', name: 'שם שוכר ', type: 'text' }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }],

        /*[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },*/

        ObjectsArray: //this.props.location.objects ? this.props.location.objects :rentalsList
        [{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },

        { RentalID: 3, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }],//
        isAutho: true,//false
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showSomthing: null


    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
    }
    componentDidUpdate = () => {

    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''

        if (object.RentPayment && object.RentPayment !== '' && !(parseFloat(object.RentPayment).toString() === object.RentPayment)) {

            erors.RentPayment = 'נא להקיש סכום'
            isErr = true
        }
        if (object.EnteryDate > object.EndDate) {
            generalEror = 'תאריך כניסה מאוחר מתאריך יציאה'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitSearch = (object) => {
        const path = 'Rental/Search';

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
    submit = (type, object) => {
        let path = 'Rental/' + type + 'Rental'
        if (type === 'Add' || type === 'Update') {
            let newObj = RentalObject()
            if (type === 'Add')
                newObj.RentalID = 1
            else
                newObj.RentalID = object.RentalID
            newObj.PropertyID = object.PropertyID
            newObj.SubPropertyID = object.SubPropertyID
            if (object.Phone !== '')
                newObj.UserID = object.UserID
            if (object.RentPayment !== '')
                newObj.RentPayment = parseFloat(object.RentPayment)
            newObj.PaymentTypeID = object.PaymentTypeID
            if (object.EnteryDate !== '')
                newObj.EnteryDate = object.EnteryDate
            if (object.EndDate !== '')
                newObj.EndDate = object.EndDate
            newObj.ContactRenew = object.ContactRenew
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }

            object = newObj

        }
        else if (type === 'Delete') {
            let id = new Number(object.RentalID)
            object = id
        }
        const bool = CommonFunctions(type, object, this.state.ObjectsArray, '/Rentals', path)
        if (bool)
            this.closeFormModal();
    }

    //אמורה להיות פונקציה שממפה עבור כל איידי את השם

    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'השכרות')
            LinksForTable = [<button onClick={() => { this.setState({ ObjectsArray: rentalsList, name: 'השכרות' }) }}>חזרה להשכרות</button>]
        else
            LinksForTable = [<button onClick={() => {
                this.setState({
                    showForm: true, showSomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }}> הוספת השכרה</button>]
        return {
            LinksForTable: LinksForTable
        }
    }
    linkToAddRenter = <button index={0} onClick={() => {
        this.setState({
            showForm: true, showSomthing: <Properties type='form'
                formType='Add'
                formName='הוסף'
                object={{}} />
        })
    }}  >הוסף נכס</button>
    linkToAddProperty = <button index={1} onClick={() => {
        this.setState({
            showForm: true, showSomthing:
                <Renter type='form'
                    formType='Add'
                    formName='הוסף'
                    object={{}} />
        })
    }}
    >הוסף שוכר</button>
    setForForm = object => {
        const fieldsToAdd = []
        const LinksPerObject = [this.linkToAddRenter, this.linkToAddProperty]
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {
        console.log(this.props.type)
        console.log('state', this.state)
        let LinksPerObject = []
        let LinksForEveryRow = []
        let ButtonsForEveryRow = []

        const docks = postFunction('User/GetUserDocuments', { id: object.RentalID, type: 3 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        const ownerobject =  postFunction('PropertyOwner/GetOwnerByID', object.OwerID) 
        const propertyObject = postFunction('Property/GetPropertyByID', object.PropertyID)
        const userObject = postFunction('Renter/GetRenterByID', object.PropertyID)
        object.PropertyID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Properties type='details' object={propertyObject}
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
        >{object.PropertyID}</Link>

        LinksPerObject.push(<button onClick={() => {
            this.setState({
                showForm: true, showSomthing:
                    <Properties type='form' formType='Update' formName='עריכה' index={0} object={propertyObject}
                        isOpen={this.state.showForm} closeModal={this.closeFormModal} />
            })
        }}>
            ערוך נכס</button>)

        if (object.SubPropertyID !== null)
            LinksPerObject.push(<button index='end' onClick={() => {
                this.setState({
                    showDetails: true, showSomthing:
                        <SubProperties isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                            object={postFunction('SubProperty/GetSubPropertyByID', object.SubPropertyID)}
                            type='details' />
                })
            }} >פרטי נכס מחולק </button>)


        object.UserID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Renter type='details' object={userObject} isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}>
            {userObject.FirstName + ' ' + userObject.LastName}</Link>

        LinksPerObject.push(<button index='end' onClick={() => {
            this.setState({
                showDetails: true, showSomthing: <PropertyOwner Object={ownerobject}
                    type='details' isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
        >{ownerobject.OwnerFirstName + ' ' + ownerobject.OwnerLastName}:משכיר</button>,

            <button index='end' onClick={() => {
                this.setState({
                    showForm: true, showSomthing:
                        <PropertyOwner type='form' formType='Update' formName='עריכה'
                            object={ownerobject} isOpen={this.state.showForm} closeModal={this.closeFormModal} />
                })
            }}>
                ערוך משכיר </button>)
        return {
            fieldsToAdd: [], LinksForEveryRow,
            ButtonsForEveryRow, object, enable: true,
            LinksPerObject
        };

    }
    rend = () => {
        console.log('rent-obj', this.props.object)
        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            console.log('some.object', some.object)
            return <Details closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}></Details>


        }
        else if (this.props.type || this.props.type === 'form') {

            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate} ></Form>


        }
        else
            return <div><Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} ></Table>{this.state.showSomthing}</div>

    }
    render() {
        return (
            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?

                    this.rend() : <Redirect to='/a' />}


            </div>
        )



    }
}

export default connect(mapStateToProps)(Rentals)
export const rentalsList = GetFunction('Rental/GetAllRentals');