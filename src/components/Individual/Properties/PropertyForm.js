import React, { Component, PureComponent } from 'react'
import Form from '../../General/Form/Form'
import { CommonFunctions, GetFunction, postFunction } from '../../General/CommonAxiosFunctions';
import PropertyObject from '../../../Models-Object/PropertyObject';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import PopUpForProperties from '../PopUpForProperty/PopUpForProperties';
import PropertyOwner from '../PropertyOwner/PropertyOwner';
import * as Action from '../../General/Action'
import './Properties.css';

export class PropertyFormDetails extends PureComponent {
    state = {
        fieldsArray: [...this.props.fieldsArray]
    }
    //בדיקת תקינות אוביקט מסוג נכס
    validate = object => {
        let isErr = false
        let erors = []
        this.props.fieldsArray.map(field => { erors[field.field] = "" })
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

        const res = await CommonFunctions(Action.Add, object, path);

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

        this.props.redirect()

    }
    //סבמיט לחיפוש

    //סבמיט לפורם (הוספה,עדכון ומחיקה)
    submit = async (type, object) => {

        let path = 'Property/' + type + 'Property';
        if (type === Action.Add || type === Action.Update) {

            let newObj = PropertyObject();

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
            if (type === Action.Add)
                newObj.PropertyID = 1
            else
                newObj.PropertyID = object.PropertyID;

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
            newObj.IsInsured = object.IsInsured
            object = newObj
        }
        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res)
    }

    linkToAddPropertyOwner = <button type='button' index={0} onClick={() => {
        this.props.showModal(
            <PropertyOwner
                type={Action.form}
                formType={Action.Add}
                closeModal={this.props.closeModal}
                formName='הוסף'
                object={{}} />)

    }}>הוסף משכיר</button>
    //פונקציה שמוסיפה ומשנה דברים שקשורים לעריכת והוספת אוביקט (באטנים ושדות שקשורים אליו)
    setForForm = (object) => {
        const streets = this.props.streets.filter(i => i.CityId === object.CityID)
        let fieldArray = this.state.fieldsArray.find(i => i.field === 'StreetID')
        if (fieldArray) {
            fieldArray.selectOptions = streets !== null ?
                streets.map(item => { return { id: item.StreetID, name: item.StreetName } }) : []
            this.setState({ fieldsArray: [...this.state.fieldsArray, fieldArray] })
        }
        //שדה של רחוב
        let fieldsToAdd = []
        //באטן להוספת עיר
        const linkToAddCity = <button type='button' index={1} onClick={() => {
            this.props.showExtentionModal(
                <PopUpForProperties
                    submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'name', name: 'שם עיר', type: 'text', required: true }]}
                    type='AddCity'
                    closeModal={this.props.closeExtentionModal} />
            )
        }} >הוסף עיר</button>
        //באטן להוספת רחוב
        const linkToAddStreet = <button type='button' index={1} onClick={() => {
            let selectOptions = []
            const city = this.state.fieldsArray.find(i => i.field === 'CityID')
            if (city && city.selectOptions)
                selectOptions = city.selectOptions
            this.props.showExtentionModal(
                <PopUpForProperties submit={this.submitForExtentions}
                    fieldsArray={[{ field: 'CityID', name: 'עיר', type: 'select', selectOptions: selectOptions, required: true }, { field: 'name', name: 'שם רחוב', type: 'text' }]}
                    type='AddStreetByCityId'
                    closeModal={this.props.closeExtentionModal} />
            )
        }}
        >הוסף רחוב</button>
        let LinksPerObject = [this.linkToAddPropertyOwner, linkToAddCity, linkToAddStreet]
        if (object.IsRented != undefined)
            fieldsToAdd.push({ field: 'IsRented', name: 'מושכר', type: 'checkbox', index: 8 })
        //אם הדירה בלעדית
        if (object.IsExclusivity) {
            //שדה של אחראי בלעדיות של הדירה

            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: this.props.exclusivityPeople, index: 12, required: true })
            //באטן להוספת אחראי בלעדיות
            LinksPerObject.push(
                <button index={12} type='button' onClick={() => {
                    this.props.showExtentionModal(
                        <PopUpForProperties submit={this.submitForExtentions}
                            fieldsArray={[{ field: 'name', name: 'שם', type: 'text', required: true }]}
                            type='AddExclusivityPerson'
                            closeModal={this.props.closeExtentionModal} />
                    )
                }}
                >הוסף אחראי בלעדיות</button>)

        }
        //הוספת שדה של הוספת מסמך
        fieldsToAdd.push()//{ ...AddDocField }
        //מחזירה אוביקט:
        //fieldsToAdd-שדות נוספים הקשורים לאוביקט
        //LinksPerObject:באטנים ולינקים הקשורים לאוביקט
        return { fieldsToAdd, LinksPerObject }
    }
    render() {

        return (
            <Form
                closeModal={this.props.closeFormModal}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.state.fieldsArray}
                submit={this.submit}
                setForForm={this.setForForm}
                validate={this.validate}
                docks={this.props.docks}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyFormDetails)
