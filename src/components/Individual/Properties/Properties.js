import React, { Component, PureComponent } from 'react'
import Table from '../../General/Table/Table'
import Form from '../../General/Form/Form'

import { Link, Redirect, withRouter } from 'react-router-dom';
import Axios from '../../Axios'
import Details from '../../General/Details/Details';
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import PropertyObject from '../../../Models-Object/PropertyObject';
import DocumentObject from '../../../Models-Object/DocumentObject'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import property from '../../../Models-Object/PropertyObject';
import SubProperties from '../SubProperties/SubProperties';
import { Rentals } from '../Rentals/Rentals';
import PopUpForProperties from '../PopUpForProperty/PopUpForProperties';
import subProperty from '../../../Models-Object/SubPropertyObject';
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'

import './Properties.css';
import RedirectTo from "../../RedirectTo";
import PropertyOwner from '../PropertyOwner/PropertyOwner';
import fileDownload from 'js-file-download'


/*PropertyID int  not null identity,
OwnerID int not null,
CityID int not null,
CityID nvarchar(max) not null,
CityID int not null,
StreetID nvarchar(max) not null,
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
//קומפוננטת נכסים
export class Properties extends PureComponent {
    componentWillMount = () => {

        const owners = this.props.ownersList.filter(i => i.status === true).map(item => {
            let name = item.OwnerFirstName !== null ? item.OwnerFirstName : '';
            name += item.OwnerLastName !== null ? ' ' + item.OwnerLastName : ''
            return { id: item.OwnerID, name: name }
        })
        const res = this.props.cities;
        const cities = res !== null ?
            res.map(item => { return { id: item.CityId, name: item.CityName } }) : [];
        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray[1].selectOptions = owners;
        fieldsArray[2].selectOptions = cities;
        let exclusivityPersons = this.props.exclusivityPeople

        exclusivityPersons = exclusivityPersons !== null ?
            exclusivityPersons.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } }) : []

        this.setState({ fieldsArray, cities, exclusivityPersons });


    }
    componentDidUpdate = (prevProps, prev) => {


        if (JSON.stringify(prev.cities) != JSON.stringify(this.state.cities) || JSON.stringify(prevProps.ownersList) != JSON.stringify(this.props.ownersList) || JSON.stringify(prev.exclusivityPersons) != JSON.stringify(this.state.exclusivityPersons)) {
            const owners = this.props.ownersList.filter(i => i.status === true).map(item => {
                let name = item.OwnerFirstName !== null ? item.OwnerFirstName : '';
                name += item.OwnerLastName !== null ? ' ' + item.OwnerLastName : ''
                return { id: item.OwnerID, name: name }
            })
            const res = this.props.cities;
            const cities = res !== null ?
                res.map(item => { return { id: item.CityId, name: item.CityName } }) : [];
            let fieldsArray = [...this.state.fieldsArray];
            fieldsArray[1].selectOptions = owners;
            fieldsArray[2].selectOptions = cities;
            let exclusivityPersons = this.props.exclusivityPeople

            exclusivityPersons = exclusivityPersons !== null ?
                exclusivityPersons.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } }) : []

            this.setState({ fieldsArray, cities, exclusivityPersons });
        }

    }
    state = {
        name: 'נכסים',
        fieldsArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text' }, { field: 'OwnerID', name: 'בעלים', type: 'select', selectOptions: [], required: true },
        { field: 'CityID', name: 'עיר', type: 'select', selectOptions: [], required: true }, { field: 'StreetID', name: 'רחוב', type: 'select', selectOptions: [], required: true, index: 1 },
        { field: 'Number', name: 'מספר', type: 'text', required: true, pattern: '[1-9][0-9]*[A-Ca-cא-ג]?' }, { field: 'Floor', name: 'קומה', type: 'number', required: true },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' }
        ],

        fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
        { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'radio', radioOptions: [{ id: 'true', name: 'מושכר' }, { id: 'false', name: 'לא מושכר' }] }],

        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.propertiesList,
        // [{ PropertyID: 1, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 2, IsDivided: false, IsRented: true, IsExclusivity: true },
        //{ PropertyID: 2, CityName: 'Haifa', StreetName: 'Pinsker', Number: 30, Floor: 5, IsDivided: true, IsRented: false, IsExclusivity: false }],//
        showForm: false,
        showDetails: false,
        showsomthing: null,
        isEx: false,
        showExtention: null,
        cities: [],
        docks: [],
        ownerobject: null,
        spobjects: null,
        rentalObject: null,
        streets: [],
        exclusivityPersons: [],
        red: null
    }
    //סוגרת חלונית מסוג דיטיילס
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showsomthing: null })
    }
    //סוגרת חלונית מסוג פורם
    closeFormModal = () => {

        this.setState({ showForm: false, showsomthing: null })
    }
    closeExtentionModal = () => {

        this.setState({ showExtention: null })

    }
    //בדיקת תקינות אוביקט מסוג נכס
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''

        //אם לא הוקש מספר
        if (object.RoomsNum && object.RoomsNum !== '' && (parseFloat(object.RoomsNum).toString() !== object.RoomsNum.toString())) {

            erors.RoomsNum = 'נא להקיש מספר חדרים'
            isErr = true
        }
        if (object.Size && object.Size !== '' && (parseFloat(object.Size).toString() !== object.Size.toString())) {
            erors.Size = 'נא להקיש גודל'
            isErr = true
        }
        if (object.ManagmentPayment && object.ManagmentPayment !== '' && (parseFloat(object.ManagmentPayment).toString() !== object.ManagmentPayment.toString())) {
            erors.ManagmentPayment = 'נא להקיש סכום'
            isErr = true
        }
        //isErr-אם יש שגיאת תקינות כלשהי
        //generalEror-תוכן שגיאהת תקינות כללית לפורם
        //erors-מערך השגיאות עבור כל אחד מהשדות
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitForExtentions = async (type, object) => {
        let path = 'Property/' + type;

        const res = await CommonFunctions('Add', object, path);

        if (res) {
            this.closeExtentionModal()
        }
        let list
        if (type.contains('City')) {
            list = await GetFunction('Property/GetAllCities')
            this.props.setCities(list !== null ? list : [])
        }
        else if (type.contains('Street')) {
            list = await GetFunction('Property/GetAllStreets')
            this.props.setStreets(list !== null ? list : [])
        }
        else {
            list = await GetFunction('Property/GetAllExclusivityPoeple')
            this.props.setExclusivityPeople(list !== null ? list : [])

        }

        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Properties' }} /> })

    }
    //סבמיט לחיפוש
    submitSearch = async (object) => {
        const path = 'Property/Search';

        if (object) {
            let objects = await SearchFor(object, path)
            if (objects) {
                let name = 'תוצאות חיפוש'
                if (objects.length === 0) {
                    name = 'לא נמצאו תוצאות'
                }
                this.setState({ ObjectsArray: [] })
                const objArray = [...objects]
                this.setState({ ObjectsArray: objArray, name, fieldsToSearch: null })

            }
        }
    }
    //סבמיט לפורם (הוספה,עדכון ומחיקה)
    submit = async (type, object) => {

        let path = 'Property/' + type + 'Property';
        if (type === 'Add' || type === 'Update') {

            let newObj = PropertyObject();
            debugger
            const proper = this.props.propertiesList.find(i => i.PropertyID === object.PropertyID)
            if (proper) {
                if (proper.IsRented !== object.IsRented) {
                    if (object.IsRented === false) {
                        const rental = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.status === true)
                        if (rental) {
                            const b = window.confirm('להסיר השכרה?')
                            if (b)
                                await postFunction('Rental/DeleteRental', { id: rental.RentalID });

                        }
                    }
                    else if (object.IsRented === true) {
                        object.IsRented = false
                        alert("לא ניתן להפוך את הנכס למושכר, יש להוסיף השכרה לנכס")
                    }
                }


            }
            if (type === 'Add')
                newObj.PropertyID = 1
            else
                newObj.PropertyID = object.PropertyID;

            // const proper=await postFunction('Property/GetPropertyByID',{id:object.PropertyID});

            newObj.CityID = object.CityID
            newObj.StreetID = object.StreetID
            newObj.OwnerID = object.OwnerID
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
            if (object.ExclusivityID && object.ExclusivityID !== '')
                newObj.ExclusivityID = object.ExclusivityID
            newObj.IsWarranty = object.IsWarranty
            if (object.add) {
                newObj.docName = object.document
                newObj.Dock = object.add
            }

            object = newObj
        }

        else if (type === 'Delete') {
            const con = window.confirm('למחוק נכס?')
            if (con === false)
                return;
            object = { id: object.PropertyID }
        }

        const res = await CommonFunctions(type, object, path)
        let list = await GetFunction('Property/GetAllProperties')
        this.props.setProperties(list !== null ? list : [])
        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        //this.props.history.push({ pathname: '/RedirectTo', redirect: '/Properties' })
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Properties' }} /> })
        return res
        //אם מה שחזר מהשרת אינו נל, סימו שהבקשה הצליחה וניתן ל סגור את החלונית
        // if (res && res !== null) {
        //     this.closeFormModal();
        // }

    }
    componentDidUpdate() {
        debugger
    }

    //פונקציה להוספת דברים הקשורים לקומפוננטת טייבל
    setForTable = () => {
        let LinksForTable = []
        //באטן לחזרה לנכסים (כשנמצאים בחיפוש)
        if (this.state.name !== 'נכסים')
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({
                    ObjectsArray: this.props.propertiesList, name: 'נכסים'
                    , fieldsToSearch: [{ field: 'CityName', name: 'עיר', type: 'text' }, { field: 'StreetName', name: 'רחוב', type: 'text' },
                    { field: 'Number', name: 'מספר', type: 'text' }, { field: 'Floor', name: 'קומה', type: 'number' }, { field: 'IsRented', name: 'מושכר', type: 'radio', radioOptions: [{ id: 'true', name: 'מושכר' }, { id: 'false', name: 'לא מושכר' }] }]
                })
            }}>חזרה לנכסים</button>]
        else {
            //באטן להוספת נכס
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                let fieldsArray = [...this.state.fieldsArray]
                fieldsArray.splice(0, 1)
                this.setState({
                    showsomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={fieldsArray} Object={{}} submit={this.submit} type='Add' name='הוסף'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }}>
                הוספת נכס</button>]
        }
        return { LinksForTable }


    }
    //באטן להוספת משכיר (ירונדר בפורם)
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


    //פונקציה שמוסיפה ומשנה דברים שקשורים לעריכת והוספת אוביקט (באטנים ושדות שקשורים אליו)
    setForForm = (object) => {

        // postFunction('Property/GetStreetsByCityID', { id: object.CityID }).
        //     then(res => this.setState({
        //         fieldsArray:
        //             [...this.state.fieldsArray, this.state.fieldsArray[3].selectOptions = res !== null ?
        //                 res.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []]
        //    }))
        // const selectOptions = this.state.streets !== null ?
        //     this.state.streets.map() : []

        const streets = this.props.streets.filter(i => i.CityId === object.CityID)
        this.setState({
            fieldsArray:
                [...this.state.fieldsArray, this.state.fieldsArray[3].selectOptions = streets !== null ?
                    streets.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []]
        })

        //שדה של רחוב
        let fieldsToAdd = []
        //באטן להוספת עיר
        const linkToAddCity = <button type='button' index={1} onClick={() => {
            this.setState({ isEx: true })
            this.setState({
                showExtention:
                    <PopUpForProperties submit={this.submitForExtentions}
                        fieldsArray={[{ field: 'name', name: 'שם עיר', type: 'text', required: true }]}
                        type='AddCity' isOpen={this.state.isEx} closeModal={this.closeExtentionModal} />
            })
        }} >הוסף עיר</button>
        //באטן להוספת רחוב
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
        if (object.IsRented != undefined)
            fieldsToAdd.push({ field: 'IsRented', name: 'מושכר', type: 'checkbox', index: 8 })
        //אם הדירה בלעדית
        if (object.IsExclusivity) {
            //GetFunction('Property/GetAllexclusivityPersons').then(res => this.setState({ exclusivityPersons: res }))
            // const res = this.state.exclusivityPersons !== null ?
            //     this.state.exclusivityPersons.map(item => { return { id: item.ExclusivityID, name: item.ExclusivityName } }) :
            //     [];
            //שדה של אחראי בלעדיות של הדירה
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: this.state.exclusivityPersons, index: 12, required: true })

            //באטן להוספת אחראי בלעדיות
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

        const docks = this.props.documents.filter(i => i.type === 1 && i.DocUser === object.PropertyID)
        if (docks && docks[0]) {

            LinksPerObject.push(<div index='end'>{DocDeleteButton(docks, this.props.setDocuments)}</div>)


        }
        //הוספת שדה של הוספת מסמך
        fieldsToAdd.push({ ...AddDocField })



        //מחזירה אוביקט:
        //fieldsToAdd- שדות נוספים הקשורים לאוביקט
        //LinksPerObject: באטנים ולינקים הקשורים לאוביקט
        return { fieldsToAdd, LinksPerObject }

    }
    //פונקציה שמוסיפה ומשנה דברים שקשורים לתצוגת אוביקט (גם באוביקט עצמו וגם באטנים ושדות שקשורים אליו)
    set = (object) => {    //הפונקציה ממפה את כל השדות של האוביקט והופכת איידי לשם ואת המפתחות זרים לקישורים

        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let tempobject = { ...object };
        let LinksForEveryRow = []
        let fieldsToAdd = []
        if (parseInt(object.StreetID)) {
            const street = this.props.streets.find(i => i.CityId === object.CityID && i.StreetID == object.StreetID)

            tempobject.StreetID = street.StreetName
        }
        if (parseInt(object.CityID)) {
            const city = this.props.cities.find(i => i.CityId === object.CityID)
            tempobject.CityID = city.CityName
        }

        // const selectOptions = this.props.streets !== null ?
        //     this.state.streets.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []
        // //הוספת שדה רחוב
        // 
        // object.StreetID = selectOptions.find(i => i.StreetID === object.StreetID).StreetName;


        fieldsToAdd.push({ field: 'IsRented', name: 'מושכר', type: 'checkbox', index: 8 })
        const rentalObject = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.status === true)
        debugger
        //אם הדירה מושכרת
        if (object.IsRented && rentalObject) {


            // יהיה קישור באוביקט עצמו לפרטי ההשכרה
            tempobject.IsRented = <Link onClick={() => {
                this.setState({ showDetails: true })
                this.setState({
                    showsomthing: <Rentals

                        isOpen={this.state.showDetails}
                        closeModal={this.closeDetailsModal}
                        object={rentalObject}
                        paymentTypes={this.props.paymentTypes}
                        propertiesList={this.props.propertiesList}
                        SubPropertiesList={this.props.SubPropertiesList}
                        rentersList={this.props.rentersList}
                        ownersList={this.props.ownersList}
                        documents={this.props.documents}
                        user={this.props.user}
                        rentalsList={this.props.rentalsList}
                        cities={this.props.cities}
                        streets={this.props.streets}
                        setRentals={this.props.setRentals}
                        setProperties={this.props.setProperties}
                        setDocuments={this.props.setDocuments}
                        setTasks={this.props.setTasks}

                        type='details'
                    />
                })
            }}//במקום הוי אמורים לשים אייקון שמסמל כן
            >V</Link>

            //באטן לעריכת ההשכרה
            LinksPerObject.push(<button index={7} type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <Rentals type='form'
                        formType='Update'
                        formName='ערוך השכרה'
                        isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                        object={rentalObject}
                        user={this.props.user}
                        documents={this.props.documents}
                        paymentTypes={this.props.paymentTypes}
                        rentersList={this.props.rentersList}
                        rentalsList={this.props.rentalsList}
                        propertiesList={this.props.propertiesList}
                        SubPropertiesList={this.props.SubPropertiesList}
                        cities={this.props.cities}
                        streets={this.props.streets}
                        setRentals={this.props.setRentals}
                        setProperties={this.props.setProperties}
                        setDocuments={this.props.setDocuments}
                        setTasks={this.props.setTasks} />
                })
                this.forceUpdate()
            }}>ערוך השכרה</button>)
        }
        //אחרת, אם לא מושכרת
        else {

            tempobject.IsRented = 'X'//במקום האיקס אמורים לשים אייקון שמסמל לא
            //באטן להוספת השכרה
            LinksPerObject.push(<button type='button' index={7} onClick={() => {

                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <Rentals type='form'
                        formType='Add'
                        formName='הוסף השכרה'
                        isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                    // paymentTypes={this.props.paymentTypes}
                    // propertiesList={this.props.propertiesList}
                    // SubPropertiesList={this.props.SubPropertiesList}
                    // rentersList={this.props.rentersList}
                    // ownersList={this.props.ownersList}
                    // documents={this.props.documents}
                    // rentalsList={this.props.rentalsList}
                    // user={this.props.user}
                    // cities={this.props.cities}
                    // streets={this.props.streets}
                    // object={{ PropertyID: object.PropertyID }}
                    // setRentals={this.props.setRentals}
                    // setProperties={this.props.setProperties}
                    // setDocuments={this.props.setDocuments}
                    // setTasks={this.props.setTasks} 
                    />
                })
            }}>הוסף השכרה</button>)
        }
        //אםהנכס מחולק לכמה נכסים
        if (object.IsDivided) {

            // postFunction('SubProperty/GetSubPropertiesOfParentProperty', { id: object.PropertyID }).then(res => this.setState({ spobjects: res }))
            const spobjects = this.props.SubPropertiesList.filter(i => i.SubPropertiesID === object.SubPropertiesID)
            //לינק לטבלה המציגה את כל הנכסים המחולקים שלו
            tempobject.IsDivided = <Link
                to={{ pathname: '/SubProperties', objects: spobjects, PropertyID: object.PropertyID }}>V</Link>//במקום הוי אמורים לשים אייקון שמסמל כן
            //באטן להוספת תת נכס
            LinksPerObject.push(<button type='button' index={9} onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showsomthing: <SubProperties type='form'
                        //isOpen={this.state.showForm}
                        closeModal={this.closeFormModal}
                        formType='Add'
                        formName='הוסף נכס מחולק'
                        object={{ PropertyID: object.PropertyID }} />
                })
            }} >הוסף-נכס-משנה</button>)
        }

        else
            tempobject.IsDivided = 'X'//במקום האיקס אמורים לשים אייקון שמסמל לא
        //postFunction('Property/GetRentalByPropertyID', { id: object.propertyID }).then(res => this.setState({ rentalObject: res }))
        //אם הדירה בלעדית
        if (object.IsExclusivity) {
            tempobject.IsExclusivity = 'V'
            //שדה של אחראי בלעדיות של הדירה
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: this.state.exclusivityPersons, index: 12 })

            if (object.ExclusivityID)
                tempobject.ExclusivityID = this.state.exclusivityPersons.find(i => i.id === object.ExclusivityID).name
        }
        else
            tempobject.IsExclusivity = 'X'
        if (object.IsWarranty)
            tempobject.IsWarranty = 'V'
        else
            tempobject.IsWarranty = 'X'


        //בשדה משכיר ,באטן לפרטי משכיר
        //postFunction('PropertyOwner/GetOwnerByID', { id: object.OwnerID }).then(res => this.setState({ ownerobject: res }))
        // this.setState({ ownerobject: this.state.fieldsArray[1].selectOptions.find(i => i.id === object.OwnerID) })

        const ownerobject = this.props.ownersList.find(i => i.OwnerID === object.OwnerID)
        let ownerName = ownerobject.OwnerFirstName !== null ? ownerobject.OwnerFirstName : '';
        ownerName += ownerobject.OwnerLastName ? ' ' + ownerobject.OwnerLastName : ''
        tempobject.OwnerID = (<Link onClick={() => {
            this.setState({
                showDetails: true,
                showsomthing: <PropertyOwner
                    isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                    object={ownerobject}
                    user={this.props.user}
                    propertiesList={this.props.propertiesList}
                    documents={this.props.documents}
                    type='details'
                />
            })
        }}>{ownerobject && ownerName} </Link>)



        // postFunction('User/GetUserDocuments', { id: object.PropertyID, type: 1 }).then(res => this.setState({ docks: res }))
        //באטנים שיציגו את כל המסמכים הקשורים לדירה
        const docks = this.props.documents.filter(i => i.type === 1 && i.DocUser === object.PropertyID)

        if (docks && docks[0]) {
            fieldsToAdd.push({ field: 'doc', name: 'מסמכים', type: 'file', index: 'end' })
            tempobject.doc = DocButtons(docks)
        }
        //מחזירה אוביקט:
        //fieldsToAdd- שדות נוספים הקשורים לאוביקט
        //LinksForEveryRow:לינקים שיש להוסיף בהצגת האוביקט (בקומפוננטת דיטיילס)
        //ButtonsForEveryRow:באטנים שיש להוסיף לכל שורה בטבלה
        //object- האוביקט לאחר השינויים שנעשו בו
        //LinksPerObject: באטנים ולינקים הקשורים לאוביקט
        debugger
        return {
            fieldsToAdd, LinksForEveryRow,
            ButtonsForEveryRow, object: tempobject, LinksPerObject

        };

    }
    //פונקציה הבוחרת מה לרנדר  בהתאם לטייפ שנשלח אליה
    rend = () => {
        let whatToRender = []
        // מציג פרטים של אוביקט מסוים מסוג נכס 
        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            whatToRender.push(<Details closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}

            />)

        }
        //מציג הוספה או עריכה של אוביקט מסיג נכס
        else if (this.props.type === 'form') {
            let fieldsArray = [...this.state.fieldsArray];
            fieldsArray.splice(0, 1)
            whatToRender.push(<Form closeModal={this.props.closeModal} isOpen={this.props.isOpen}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={fieldsArray}
                submit={this.submit} setForForm={this.setForForm}
                validate={this.validate}
            />)
        }
        //אם לא נשלח טייפ תוצג הטבלה של כל הנכסים
        else {
            let fieldsArray = [...this.state.fieldsArray]
            // fieldsArray.splice(0, 1)
            whatToRender.push(<div><Table name={this.state.name} fieldsArray={fieldsArray}
                objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch}
            /></div>, this.state.showsomthing, this.state.showExtention, this.state.red)
        }

        return whatToRender
    }
    render() {
        console.log('this.props-properties-less', this.props)
        return (

            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/' />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Properties))

