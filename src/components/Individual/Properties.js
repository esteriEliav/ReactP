import React, { Component } from 'react'
import Table from '../General/Table'
import Form from '../General/Form'

import { Link, Redirect } from 'react-router-dom';
import Axios from '../Axios'
import Details from '../General/Details';
import { ownersList, PropertyOwner } from './PropertyOwner'
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
import PropertyObject from '../../Models-Object/PropertyObject';
import DocumentObject from '../../Models-Object/DocumentObject'
import { mapStateToProps } from '../Login'
import { connect } from 'react-redux'
import property from '../../Models-Object/PropertyObject';
import SubProperties from './SubProperties';
import { Rentals } from './Rentals';
import PopUpForProperties from './PopUpForProperties';
import subProperty from '../../Models-Object/SubPropertyObject';



/*PropertyID int  not null identity,
OwnerID int not null,
CityID int not null,
CityName nvarchar(max) not null,
StreetID int not null,
StreetName nvarchar(max) not null,
Number nvarchar(5) not null,

"Floor" int,
ApartmentNum int null,--תוספת
Size float,--גודל דירה
RoomsNum float null,--תוספת
IsDivided bit not null constraint DF_Properties_IsDivided default 0,
ManagmentPayment float,--דמי ניהול
IsPaid bit not null constraint DF_Properties_IsPaid default 0,
IsRented bit not null constraint DF_Properties_IsRented default 0,
IsExclusivity bit not null constraint DF_Properties_IsExclusivity default 0,
ExclusivityID int,
IsWarranty bit not null constraint DF_Properties_IsWarranty default 0,-- האם באחריות 
*/
export class Properties extends Component {
    owners = ownersList.map(item => { return { id: item.OwnerID, name: item.OwnerFirstName + ' ' + item.OwnerLastName } })
    exclusivityPersons = []// GetFunction('Property/GetAllexclusivityPersons').map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } })
    cities = []// GetFunction('Property/GetAllCites').map(item => { return { id: item.CityID, name: item.CityName } })

    state = {
        name: 'נכסים',
        fieldsArray: [{ field: 'OwnerID', name: 'בעלים', type: 'select', /*selectOptions: this.owners,*/ required: true },
        { field: 'CityID', name: 'עיר', type: 'select', selectOptions: this.cities, required: true },
        { field: 'Number', name: 'מספר', type: 'text', required: true, pattern: '[1-9][0-9]*[A-Ca-cא-ג]?' }, { field: 'Floor', name: 'קומה', type: 'number', required: true },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsRented', name: 'מושכר', type: 'checkbox' }, { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' },
        { field: 'document', name: 'מסמך', type: 'file', index: 'end' }],

        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'checkbox' }],

        ObjectsArray: this.props.location.objects ? this.props.location.objects :/*propertiesList*/[{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        { PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: false, IsRented: false, IsExclusivity: false }],//
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showsomthing: null,
        isAutho: true//false
    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showsomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showsomthing: null })
    }
    changeStreetOptions = () => {

    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.RoomsNum && object.RoomsNum !== '' && !(parseFloat(object.RoomsNum).toString() === object.RoomsNum)) {

            erors.RoomsNum = 'נא להקיש מספר'
            isErr = true
        }
        if (object.Size && object.Size !== '' && !(parseFloat(object.Size).toString() === object.Size)) {
            erors.Size = 'נא להקיש מספר'
            isErr = true
        }
        if (object.ManagmentPayment && object.ManagmentPayment !== '' && !(parseFloat(object.ManagmentPayment).toString() === object.ManagmentPayment)) {
            erors.ManagmentPayment = 'נא להקיש מספר'
            isErr = true
        }
        isErr = false
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitForExtentions = (type, object) => {
        let path = '/Property/' + type;
        if (type === 'AddCity' || type === 'AddExclusivityPerson')
            object = object.name
        return postFunction(path, object);
    }
    submitSearch = (object) => {
        const path = 'Property/Search';

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

        let path = 'Property/' + type + 'Property';
        if (type === 'Add' || type === 'Update') {
            let newObj = PropertyObject();
            if (type === 'Add')
                newObj.PropertyID = 1
            else
                newObj.PropertyID = object.PropertyID;
            newObj.CityID = object.CityID
            newObj.StreetID = object.StreetID
            newObj.Number = object.Number
            if (object.Floor !== '')
                newObj.ApartmentNum = object.Floor
            if (object.Floor !== '')
                newObj.ApartmentNum = object.ApartmentNum
            if (object.Size !== '')
                newObj.Size = object.Size
            if (object.IsDivided !== '')
                newObj.IsDivided = object.IsDivided
            if (object.ManagmentPayment !== '')
                newObj.ManagmentPayment = object.ManagmentPayment
            newObj.IsPaid = object.IsPaid
            newObj.IsRented = object.IsRented
            newObj.IsExclusivity = object.IsExclusivity
            if (object.exclusivityPersons !== '')
                newObj.exclusivityPersons = object.exclusivityPersonsnpm
            newObj.IsWarranty = object.IsWarranty
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add
            }

            object = newObj
        }
        else if (type === 'Delete') {
            let id = new Number(object.propertyID)
            object = id
        }

        const bool = CommonFunctions(type, object, this.state.ObjectsArray, '/Properties', path)
        if (bool)

            this.closeFormModal();


    }



    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'נכסים')
            LinksForTable = [<button onClick={() => { this.setState({ ObjectsArray: propertiesList, name: 'נכסים' }) }}>חזרה לנכסים</button>]
        else
            LinksForTable = [<button onClick={() => { this.setState({ showForm: true }) }}
            > {this.state.showForm && <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                setForForm={this.setForForm}
                validate={this.validate} />}
            הוספת נכס</button>]
        return { LinksForTable }


    }
    linkToAddPropertyOwner = <button onClick={() => { this.setState({ showForm: true }) }} index={0}>
        {this.state.showForm && <PropertyOwner type='form' formType='Add' closeModal={this.closeFormModal} isOpen={this.state.showForm}
            formName='הוסף'
            object={{}} />}הוסף משכיר</button>



    set = (object) => {    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let tempobject = { ...object };
        let LinksForEveryRow = []
        const fieldsToAdd = [{ field: 'PropertyID', name: 'קוד דירה', type: 'text', index: 0 },
        ...this.setForForm(object).fieldsToAdd]
        //const docks=postFunction('')
        const ownerobject = {}// postFunction('PropertyOwner/GetOwnerByID', object.OwerID)

        if (object.IsDivided) {
            tempobject.IsDivided = <Link onClick={this.setState({ showTable: true })}>
                {<SubProperties
                    objects={postFunction('SubProperty/GetSubPropertiesOfParentProperty', object.PropertyID)} type='table' />}

            V</Link>//ששולח פרטי נכסי בן של הדירה
            LinksPerObject.push(<button onClick={() => { this.setState({ showForm: true }) }} index={12}>
                {this.state.showForm && <SubProperties type='form'
                    formType='Add'
                    formName='הוסף נכס מחולק'
                    object={{ propertyID: tempobject.propertyID }} />}
            הוסף נכס מחולק</button>)

        }

        else
            tempobject.IsDivided = 'X'

        const rentalObject = {} //postFunction('Property/GetRentalByPropertyID', object.propertyID)
        if (object.IsRented) {
            tempobject.IsRented = <Link onClick={() => {
                this.setState({
                    showDetails: true,
                    showsomthing: <Rentals
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                        object={rentalObject}
                        type='details'
                    />
                })
            }}>
                V</Link>
        }
        else
            tempobject.IsDivided = 'X'//ושולח פרטי השכרה שמתקבלים מהפונקציה
        LinksPerObject.push(<button index={7} onClick={() => {
            this.setState({
                showForm: true,
                showsomthing: <Rentals type='form'
                    formType='Add'
                    formName='הוסף השכרה'
                    object={{ propertyID: tempobject.propertyID }} />
            })
        }}>הוסף השכרה</button>)




        const docks = postFunction('User/GetUserDocuments', { id: object.PropertyID, type: 1 })
        if (docks && docks[0])
            object.document = docks.map((dock, index) => <button key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        tempobject.OwnerID = <Link onClick={() => {
            this.setState({
                showDetails: true,
                showsomthing: <Rentals
                    isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                    object={ownerobject}
                    type='details'
                />
            })
        }}>{ownerobject.firstName + ' ' + ownerobject.lastName} </Link>

        return {
            fieldsToAdd: this.setForForm(object).fieldsToAdd, LinksForEveryRow, enable: true,
            ButtonsForEveryRow, object: tempobject, LinksPerObject

        };

    }
    setForForm = (object) => {
        const selectOptions = postFunction('Property/GetStreetsByCityID', object.CityID).map(item => { return { id: item.StreetID, name: item.StreetName } })
        let fieldsToAdd = [{ field: 'StreetID', name: 'רחוב', type: 'select', selectOptions, required: true, index: 1 }]

        const linkToAddCity = <button index={1} onClick={() => this.setState({
            showForm: true, showsomthing:
                <PopUpForProperties submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'name', name: 'שם עיר', type: 'text', required: true }]}
                    type='AddCity' isOpen={this.state.open} closeModal={this.closeFormModal} />
        })} >הוסף עיר</button>
        const linkToAddStreet = <button index={1} onClick={() => this.setState({
            showForm: true, showsomthing:
                <PopUpForProperties submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'CityID', name: 'עיר', type: 'select', selectOptions: this.cities, required: true }, { field: 'name', name: 'שם רחוב', type: 'text' }]}
                    type='AddStreetByCityId' isOpen={this.state.open} closeModal={this.closeFormModal} />
        })}
        >הוסף רחוב</button>
        let LinksPerObject = [this.linkToAddPropertyOwner, linkToAddCity, linkToAddStreet]
        console.log('IsExclusivity', object.IsExclusivity)
        if (object.IsExclusivity) {
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select',/* selectOptions: this.exclusivityPersons,*/ index: 12 })
            LinksPerObject.push(
                <button index={12} onClick={() => this.setState({
                    showForm: true, showsomthing: <PopUpForProperties submit={this.submitForExtentions}
                        fieldsArray={[{ field: 'name', name: 'שם', type: 'text', required: true }]}
                        type='AddExclusivityPerson' isOpen={this.state.open} closeModal={this.closeFormModal} />
                })}
                >הוסף אחראי בלעדיות</button>)
        }
        return { fieldsToAdd, LinksPerObject }

    }

    rend = () => {
        if (this.props.type === 'details') {
            console.log("from properties", this.props.showDetails)
            const some = this.set(this.props.object)
            return <Details closeModal={this.props.closeModal} isOpen={this.props.isOpen}
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
                name={this.props.name}
                type={this.props.type}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate}
            />
        }
        else {

            let fieldsArray = [...this.state.fieldsArray]
            fieldsArray.splice(3, 0, { field: 'StreetID', name: 'רחוב', type: 'select', selectOptions: [], required: true })
            return <div><Table name={this.state.name} fieldsArray={fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />{this.state.showsomthing}</div>
        }
    }
    render() {
        console.log('this.props.user', this.props.user)
        return (

            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/a' />}

            </div>
        )
    }
}

export default connect(mapStateToProps)(Properties)


export const propertiesList = [];//GetFunction('Property/GetAllProperties');

