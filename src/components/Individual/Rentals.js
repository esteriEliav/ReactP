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

    state = {
        name: 'השכרות',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד נכס', type: 'select', selectOptions: [] }, { field: 'UserID', name: 'שוכר', type: 'select', selectOptions: [] },
        { field: 'RentPayment', name: 'דמי שכירות', type: 'text' }, { field: 'PaymentTypeID', name: 'סוג תשלום', type: 'radio', radioOptions: [], required: true }, { field: 'EnteryDate', name: 'תאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }, { field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'Owner', name: 'שם משכיר', type: 'text' }, { field: 'User', name: 'שם שוכר ', type: 'text' },
        { field: 'EnteryDate', name: 'מתאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'עד תאריך סיום חוזה', type: 'date' }],
        /*[{ RentalID: 1, PropertyID: 4, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },*/
        ObjectsArray:// this.props.location.objects ? this.props.location.objects :rentalsList
            [{ RentalID: 1, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-01-02', EndDate: '2019-12-02', ContactRenew: false },
            { RentalID: 3, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }],//
        isAutho: true,//false
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,

        showSomthing: null,
        spobject: {},
        docks: [],
        owner: {},
        property: {},
        userObject: {}


    }
    componentDidMount = async () => {
        const PaymentTypeOptions = await GetFunction('Rental/GetAllPaymentTypes')
        const renters = rentersList.map(item => { return { id: item.OwnerID, name: item.FirstName + ' ' + item.LastName } })
        const cities = await GetFunction('Property/GetAllCities')
        const propertiesOptions = propertiesList.map(async item => {
            const street = await postFunction('Property/GetStreetByID', {id:item.CityID});
            if (street !== null)
                return { id: item.PropertyID, name: item.PropertyID + ':' + street.streetName + ' ' + item.Number + ' ' + cities.find(city => city.CityID === item.CityID).cityName }
        })
        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray[0].selectOptions = propertiesOptions;
        fieldsArray[1].selectOptions = renters;
        fieldsArray[3].radioOptions = PaymentTypeOptions;
        this.setState({ fieldsArray })

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
    submit = async (type, object) => {
        let path = 'Rental/' + type + 'Rental'
        if (type === 'Add' || type === 'Update') {
            let newObj = RentalObject()
            if (type === 'Add')
                newObj.RentalID = 1
            else
                newObj.RentalID = object.RentalID
            // newObj.PropertyID = object.PropertyID
            //newObj.SubPropertyID = object.SubPropertyID
            if (object.Phone && object.Phone !== '')
                newObj.UserID = object.UserID
            if (object.RentPayment && object.RentPayment !== '')
                newObj.RentPayment = parseFloat(object.RentPayment)
            newObj.PaymentTypeID = object.PaymentTypeID
            if (object.EnteryDate && object.EnteryDate !== '')
                newObj.EnteryDate = object.EnteryDate
            if (object.EndDate && object.EndDate !== '')
                newObj.EndDate = object.EndDate
            newObj.ContactRenew = object.ContactRenew
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add

            }
            ;
            object = newObj

        }
        else if (type === 'Delete') {
            object = { id: object.RentalID }
        }
        const res = await CommonFunctions(type, object, path)
            ;
        if (res && res !== null) {
            this.closeFormModal();
        }
    }

    //אמורה להיות פונקציה שממפה עבור כל איידי את השם

    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'השכרות')
            LinksForTable = [<button type='button' onClick={() => { this.setState({ ObjectsArray: rentalsList, name: 'השכרות' }) }}>חזרה להשכרות</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }}> הוספת השכרה</button>]
        return {
            LinksForTable: LinksForTable
        }
    }
    linkToAddRenter = <button type='button' index={0} onClick={() => {
        this.setState({ showForm: true })
        this.setState({
            showSomthing: <Properties type='form'
                formType='Add'
                formName='הוסף'
                isOpen={this.state.showForm}
                closeModal={this.closeFormModal}
                object={{}} />
        })
    }}  >הוסף נכס</button>
    linkToAddProperty = <button type='button' index={1} onClick={() => {
        ;
        this.setState({ showForm: true })
        this.setState({
            showSomthing:
                <Renter type='form'
                    formType='Add'
                    formName='הוסף'
                    isOpen={this.state.showForm}
                    closeModal={this.closeFormModal}
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
        debugger;
        console.log(this.props.type)
        console.log('state', this.state)
        let LinksPerObject = []
        let LinksForEveryRow = []
        let ButtonsForEveryRow = []
        postFunction('User/GetUserDocuments', { id: object.RentalID, type: 3 }).then(res => this.setState({ docks: res }))

        if (this.state.docks && this.state.docks[0])
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)

        postFunction('Property/GetPropertyByID', { id: object.PropertyID }).then(res => this.setState({ property: res }))
        postFunction('PropertyOwner/GetOwnerByID', { id: this.state.property.OwnerID }).then(res => this.setState({ owner: res }))

        postFunction('Renter/GetRenterByID', { id: object.UserID }).then(res => this.setState({ userObject: res }))

        object.PropertyID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Properties type='details' object={this.state.property !== null ? this.state.property : {}}
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
        >{object.PropertyID}</Link>

        LinksPerObject.push(<button type='button' onClick={() => {
            this.setState({
                showForm: true, showSomthing:
                    <Properties type='form' formType='Update' formName='עריכה' index={0} object={this.state.property}
                        isOpen={this.state.showForm} closeModal={this.closeFormModal} />
            })
        }}>
            ערוך נכס</button>)

        if (object.SubPropertyID !== null) {
            postFunction('SubProperty/GetSubPropertyByID', { id: object.SubPropertyID }).then(res => this.setState({ spobject: res }))
            LinksPerObject.push(<button type='button' index='end' onClick={() => {
                this.setState({ showDetails: true })
                this.setState({
                    showSomthing:
                        <SubProperties isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                            object={this.state.spobject}
                            type='details' />
                })
            }} >פרטי נכס מחולק </button>)

        }
        object.UserID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Renter type='details' object={this.state.userObject !== null ? this.state.userObject : {}}
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}>
            {this.state.userObject && this.state.userObject.FirstName + ' ' + this.state.userObject.LastName}</Link>

        object.EnteryDate = new Date(object.EnteryDate).toLocaleDateString();
        object.EndDate = new Date(object.EndDate).toLocaleDateString();
        LinksPerObject.push(<button type='button' index='end' onClick={() => {
            this.setState({
                showDetails: true, showSomthing: <PropertyOwner Object={this.state.ownerobject}
                    type='details' isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
        >{this.state.ownerobject && this.state.ownerobject.OwnerFirstName + ' ' + this.state.ownerobject.OwnerLastName}:משכיר</button>,

            <button type='button' index='end' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <PropertyOwner type='form' formType='Update' formName='עריכה'
                            object={this.state.ownerobject} isOpen={this.state.showForm} closeModal={this.closeFormModal} />
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
        ;
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
                { (this.props.user.RoleID === 1 || this.props.user.RoleID === 2) ?

                    this.rend() : <Redirect to='/a' />}


            </div>
        )



    }
}

export default connect(mapStateToProps)(Rentals)



export const rentalsList = [{ RentalID: 1, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
{ RentalID: 3, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }];
//res = await GetFunction('Rental/GetAllRentals') ;
