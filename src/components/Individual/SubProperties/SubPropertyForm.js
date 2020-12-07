import React, { Component, PureComponent } from 'react'
import Form from '../../General/Form/Form'
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';
import SubPropertyObject from '../../../Models-Object/SubPropertyObject'
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Rentals from '../Rentals/Rentals';
import RedirectTo from "../../RedirectTo";
import { DocButtons, DocDeleteButton, DocField, AddDocField } from '../../General/CommonFunctions'

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


export class SubPropertyForm extends PureComponent {

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
    submit = async (type, object) => {
        let path = 'SubProperty/' + type + 'SubProperty'
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
        const res = await CommonFunctions(type, object, path)
        return this.props.UpdateAfterAction(res)
    }
    setForForm = object => {
        let fieldsToAdd = []
        let LinksPerObject = []
        return { fieldsToAdd, LinksPerObject }
    }

    render() {
        return (
            <Form
                closeModal={this.props.closeFormModal}
                Object={this.props.object}
                name={this.props.formName}
                type={this.props.formType}
                fieldsArray={this.props.fieldsArray}
                submit={this.submit}
                setForForm={this.setForForm}
                validate={this.validate}
                docks={this.props.docks} />
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SubPropertyForm);
