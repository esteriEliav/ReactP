import React, { Component, PureComponent } from 'react'
import Table from "../../General/Table/Table";
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import SubProperties from './SubProperties'
import { connect } from 'react-redux'
import { CommonFunctions, GetFunction, postFunction, SearchFor } from '../../General/CommonAxiosFunctions';

import fileDownload from 'js-file-download'

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


export class SubPropertyTable extends PureComponent {

    //פונקציה שממפה את כל הרשומות והופכת איידי לשם ואת המפתחות זרים לקישורים
    setForTable = () => {
        let LinksForTable = []
        return { LinksForTable }
    }
    delObject = async (object) => {
        let path = 'SubProperty/DeleteSubProperty'

        const con = window.confirm('למחוק תת נכס?')
        if (con === false)
            return;
        object = { id: object.SubPropertyID }
        const res = await CommonFunctions('Delete', object, path)
        return this.props.UpdateAfterAction(res)
    }
    actions = (type, formType, formName, object, closeModal) => {
        object.PropertyID = this.props.PropertyID
        return <SubProperties
            type={type}
            formType={formType}
            formName={formName}
            object={object}
            closeModal={closeModal} />
    }
    render() {
        return (
            <Table
                path='SubProperty'
                name={' תת נכסים לנכס מספר ' + this.props.PropertyID}
                fieldsArray={this.props.fieldsArray}
                objectsArray={this.props.objectsArray}
                setForTable={this.setForTable}
                set={this.props.set}
                actions={this.actions}
                delObject={this.delObject}
                nameAdd='תת נכס לנכס אב'
                showModal={this.props.showModal}
                closeModal={this.props.closeModal} />

        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SubPropertyTable);
