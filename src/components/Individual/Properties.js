import React, { Component } from 'react'
import Table from '../General/Table'
import Form from '../General/Form'

import { Link, Redirect } from 'react-router-dom';
import Axios from '../Axios'
import Details from '../General/Details';
import { PropertyOwner } from './PropertyOwner'
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
    componentDidMount = async () => {
        const owners = this.props.ownersList.map(item => { return { id: item.OwnerID, name: item.OwnerFirstName + ' ' + item.OwnerLastName } })
        const res = this.props.cities;
        const cities = res !== null ?
            res.map(item => { return { id: item.CityID, name: item.CityName } }) : [];
        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray[0].selectOptions = owners;
        fieldsArray[1].selectOptions = cities;
        this.setState({ fieldsArray, cities });



    }
    state = {
        name: 'נכסים',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text' }, { field: 'OwnerID', name: 'בעלים', type: 'select', selectOptions: [], required: true },
        { field: 'CityID', name: 'עיר', type: 'select', selectOptions: [], required: true },
        { field: 'Number', name: 'מספר', type: 'text', required: true, pattern: '[1-9][0-9]*[A-Ca-cא-ג]?' }, { field: 'Floor', name: 'קומה', type: 'number', required: true },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsRented', name: 'מושכר', type: 'checkbox' }, { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' }
        ],

        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'checkbox' }],

        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.propertiesList,
        // [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        //{ PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: true, IsRented: false, IsExclusivity: false }],//
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showsomthing: null,
        isEx: false,
        showExtention: null,
        cities: [],
        docks: [],
        ownerobject: null,
        spobjects: null,
        rentalObject: null,
        streets: [],
        exclusivityPersons: null
    }

    closeDetailsModal = () => {

        this.setState({ showDetails: false, showsomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showsomthing: null })
    }
    closeExtentionModal = () => {

        this.setState({ isEx: false, showExtention: null })
    }
    changeStreetOptions = () => {

    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if (object.RoomsNum && object.RoomsNum !== '' && (parseFloat(object.RoomsNum).toString() !== object.RoomsNum.toString())) {

            erors.RoomsNum = 'נא להקיש מספר'
            isErr = true
        }
        if (object.Size && object.Size !== '' && (parseFloat(object.Size).toString() !== object.Size.toString())) {
            erors.Size = 'נא להקיש מספר'
            isErr = true
        }
        if (object.ManagmentPayment && object.ManagmentPayment !== '' && (parseFloat(object.ManagmentPayment).toString() !== object.ManagmentPayment.toString())) {
            erors.ManagmentPayment = 'נא להקיש מספר'
            isErr = true
        }
        isErr = false
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitForExtentions = async (type, object) => {
        let path = '/Property/' + type;
        if (type === 'AddCity' || type === 'AddExclusivityPerson')
            object = object.name
        return await postFunction(path, object);
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
    submit = async (type, object) => {

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
                newObj.Floor = object.Floor
            if (object.Floor !== '')
                newObj.ApartmentNum = parseFloat(object.ApartmentNum)
            if (object.Size !== '')
                newObj.Size = parseFloat(object.Size)
            if (object.IsDivided !== '')
                newObj.IsDivided = object.IsDivided
            if (object.ManagmentPayment !== '')
                newObj.ManagmentPayment = parseFloat(object.ManagmentPayment)
            newObj.IsPaid = object.IsPaid
            newObj.IsRented = object.IsRented
            newObj.IsExclusivity = object.IsExclusivity
            if (object.exclusivityPersons !== '')
                newObj.exclusivityPersons = object.exclusivityPersons
            newObj.IsWarranty = object.IsWarranty
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add
            }

            object = newObj
        }

        else if (type === 'Delete') {
            object = { id: object.propertyID }
        }
        //return <CommonFunctions type={type} object={object} redirect='/Properties' path={path} />
        // const bool = CommonFunctions(type, object, this.state.ObjectsArray, , path)
        // if (bool)
        //     this.closeFormModal();
        const res = await CommonFunctions(type, object, path)
        if (res && res !== null) {
            this.closeFormModal();
        }

    }



    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'נכסים')
            LinksForTable = [<button type='button' onClick={() => { this.setState({ ObjectsArray: this.props.propertiesList, name: 'נכסים' }) }}>חזרה לנכסים</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                let fieldsArray = [...this.state.fieldsArray]
                fieldsArray.splice(0, 1)
                this.setState({
                    showsomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }}>
                הוספת נכס</button>]
        return { LinksForTable }


    }
    linkToAddPropertyOwner = <button type='button' index={0} onClick={() => {
        this.setState({ showForm: true })
        this.setState({
            showsomthing:
                <PropertyOwner type='form' formType='Add'
                    closeModal={this.closeFormModal} isOpen={this.state.showForm}
                    formName='הוסף'
                    object={{}} />
        })
    }}>הוסף משכיר</button>



    setForForm = (object) => {

        postFunction('Property/GetStreetsByCityID', { id: object.CityID }).then(res => this.setState({ streets: res }))
        const selectOptions = this.state.streets !== null ?
            this.state.streets.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []
        let fieldsToAdd = [{ field: 'StreetID', name: 'רחוב', type: 'select', selectOptions, required: true, index: 1 }]
        const linkToAddCity = <button type='button' index={1} onClick={() => {
            ;
            this.setState({ isEx: true })
            this.setState({
                showExtention:
                    <PopUpForProperties submit={this.submitForExtentions}
                        fieldsArray={[{ field: 'name', name: 'שם עיר', type: 'text', required: true }]}
                        type='AddCity' isOpen={this.state.isEx} closeModal={this.closeExtentionModal} />
            })
        }} >הוסף עיר</button>
        const linkToAddStreet = <button type='button' index={1} onClick={() => {
            this.setState({ isEx: true })
            this.setState({
                showExtention:
                    <PopUpForProperties submit={this.submitForExtentions}
                        fieldsArray={[{ field: 'CityID', name: 'עיר', type: 'select', selectOptions: this.state.cities, required: true }, { field: 'name', name: 'שם רחוב', type: 'text' }]}
                        type='AddStreetByCityId' isOpen={this.state.isEx} closeModal={this.closeExtentionModal} />
            })
        }}
        >הוסף רחוב</button>

        let LinksPerObject = [this.linkToAddPropertyOwner, linkToAddCity, linkToAddStreet]
        if (object.IsExclusivity) {
            GetFunction('Property/GetAllexclusivityPersons').then(res => this.setState({ exclusivityPersons: res }))
            const res = this.state.exclusivityPersons !== null ?
                this.state.exclusivityPersons.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } }) :
                [];
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: res, index: 12 })
            LinksPerObject.push(
                <button index={12} type='button' onClick={() => {
                    this.setState({ isEx: true })
                    this.setState({
                        showExtention: <PopUpForProperties submit={this.submitForExtentions}
                            fieldsArray={[{ field: 'name', name: 'שם', type: 'text', required: true }]}
                            type='AddExclusivityPerson' isOpen={this.state.isEx} closeModal={this.closeExtentionModal} />
                    })
                }}
                >הוסף אחראי בלעדיות</button>)

        }
        fieldsToAdd.push({ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' })
        return { fieldsToAdd, LinksPerObject }

    }
    set = (object) => {    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let tempobject = { ...object };
        let LinksForEveryRow = []
        const selectOptions = this.state.streets !== null ?
            this.state.streets.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []
        const fieldsToAdd = [{ field: 'StreetID', name: 'רחוב', type: 'select', selectOptions, required: true, index: 1 }]


        //const docks=postFunction('')
        postFunction('PropertyOwner/GetOwnerByID', { id: object.OwnerID }).then(res => this.setState({ ownerobject: res }))
        if (object.IsRented) {

            tempobject.IsRented = <Link onClick={() => {

                this.setState({ showDetails: true })
                this.setState({
                    showsomthing: <Rentals
                        isOpen={this.state.showDetails}
                        closeModal={this.closeDetailsModal}
                        object={this.state.rentalObject}
                        type='details'
                    />
                })
            }}>
                V</Link>
            LinksPerObject.push(<button index={7} onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <Rentals type='form'
                        formType='Update'
                        formName='שנה השכרה'
                        isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                        object={this.state.rentalObject} />
                })
            }}>שנה השכרה</button>)
        }
        else {
            tempobject.IsRented = 'X'//ושולח פרטי השכרה שמתקבלים מהפונקציה
            LinksPerObject.push(<button index={7} onClick={() => {

                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <Rentals type='form'
                        formType='Add'
                        formName='הוסף השכרה'
                        isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                        object={{ propertyID: object.propertyID }} />
                })
            }}>הוסף השכרה</button>)
        }
        if (object.IsDivided) {
            postFunction('SubProperty/GetSubPropertiesOfParentProperty', { id: object.PropertyID }).then(res => this.setState({ spobjects: res }))
            tempobject.IsDivided = <Link
                to={{ pathname: '/SubProperties', objects: this.state.spobjects }}>V</Link>
            //ששולח פרטי נכסי בן של הדירה
            LinksPerObject.push(<button type='button' index={12} onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <SubProperties type='form'
                        isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                        formType='Add'
                        formName='הוסף נכס מחולק'
                        object={{ propertyID: tempobject.propertyID }} />
                })
            }} >הוסף נכס מחולק</button>)
        }

        else
            tempobject.IsDivided = 'X'
        postFunction('Property/GetRentalByPropertyID', { id: object.propertyID }).then(res => this.setState({ rentalObject: res }))

        if (object.IsExclusivity) {
            const res = this.state.exclusivityPersons !== null ?
                this.state.exclusivityPersons.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } }) :
                [];
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: res, index: 12 })
        }

        postFunction('User/GetUserDocuments', { id: object.PropertyID, type: 1 }).then(res => this.setState({ docks: res }))
        if (this.state.docks && this.state.docks[0]) {
            fieldsToAdd.push({ field: 'document', name: 'מסמכים', type: 'file', index: 'end' })
            object.document = this.state.docks.map((dock, index) => <button type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{dock.name.dock.docName.substring(dock.docName.lastIndexOf('/'))}</button>)
        }
        tempobject.OwnerID = <Link onClick={() => {
            this.setState({
                showDetails: true,
                showsomthing: <Rentals
                    isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                    object={this.state.ownerobject}
                    type='details'
                />
            })
        }}>{this.state.ownerobject && this.state.ownerobject.firstName + ' ' + this.state.ownerobject.lastName} </Link>

        return {
            fieldsToAdd, LinksForEveryRow, enable: true,
            ButtonsForEveryRow, object: tempobject, LinksPerObject

        };

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
            let fieldsArray = [...this.state.fieldsArray];
            fieldsArray.splice(0, 1)
            return <Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name={this.props.name}
                type={this.props.type}
                fieldsArray={fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate}
            />
        }
        else {

            let fieldsArray = [...this.state.fieldsArray]
            fieldsArray.splice(0, 1)
            return <div><Table name={this.state.name} fieldsArray={fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />
                {this.state.showsomthing} {this.state.showExtention}</div>
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


//export const propertiesList = [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
//{ PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: true, IsRented: false, IsExclusivity: false }]
//GetFunction('Property/GetAllProperties');

