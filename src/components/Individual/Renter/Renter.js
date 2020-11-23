
import React, { Component } from 'react'
import Table from '../../General/Table'
import Details from '../../General/Details'
import Form from '../../General/Form'
import Properties from '../Properties/Properties'
import AddCommonLinks from '../../General/AddCommonLinks'
import MPropertyForRenterain1 from '../PropertiesForRenter/PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../../Axios";
import { CommonFunctions, CommonFunction, GetFunction, postFunction, SearchFor } from '../../General/CommonFunctions';
import RenterObject from '../../../Models-Object/UserObject'
import { mapStateToProps,mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Renter.css'
import RedirectTo from "../../RedirectTo";
import PropertyOwner,{DocName} from '../PropertyOwner';
import fileDownload from 'js-file-download'


// public int UserID { get; set; }
// public string Name { get; set; }
// public string SMS { get; set; }
// public string Email { get; set; }
// public string Phone { get; set; }
// public int RoleID { get; set; }
// public string UserName { get; set; }
// public string Password { get; set; }


export class Renter extends Component {
    state = {

        name: 'שוכרים',
        fieldsArray: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' },
        { field: 'LastName', name: 'שם משפחה', type: 'text' }, { field: 'SMS', name: 'SMS', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }, { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g }
            , { field: 'UserName', name: 'שם משתמש', type: 'text' }, { field: 'Password', name: 'סיסמא', type: 'text' }],
        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.rentersList,
        // [{ UserID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
        // { UserID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
        // { UserID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }],

        fieldsToSearch: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' }, { field: 'LastName', name: 'שם משפחה', type: 'text' },
        { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'text' }],
        isAutho: true,
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showSomthing: null,
        docks: [],
        objects: [],
        red:null

    }
    closeDetailsModal = () => {

        this.setState({ showDetails: false, showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({ showForm: false, showSomthing: null })
    }
    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        // if (object.SMS === '' && object.Email === '') {
        //     generalEror = 'SMS חובה להכניס אימייל או '
        //     isErr = true
        // }
        if((object.FirstName===undefined || object.FirstName==='' ) && (object.LastName===undefined || object.LastName==='' ))
        {
            generalEror = 'חובה להכניס שם או שם משפחה'
            isErr = true
        }
        if (!object.Email || object.Email === '') {
            erors.Email = 'חובה להכניס אימייל'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }
    submitSearch =async (object) => {
        const path = 'Renter/Search';

        if (object) {
            let objects =await SearchFor(object, path)
            if (objects)
            {
            let name = 'תוצאות חיפוש'
            if (objects.length === 0) {
                name = 'לא נמצאו תוצאות'
            }
            this.setState({ObjectsArray:[]})
            const objArray=[...objects]
            this.setState({ ObjectsArray: objArray, name,fieldsToSearch:null })
        }
        }
    }
    submit = async (type, object) => {
        ;
        let path = 'Renter/' + type + 'Renter';
        if (type === 'Add' || type === 'Update') {

            let UserID = null, FirstName = null, LastName = null, SMS = null, Email = null, Phone = null, UserName = null, Password = null, Dock = null, docName = null
            if (type === 'Add')
                UserID = 1
            else
                UserID = object.UserID
            if (object.FirstName !== '')
                FirstName = object.FirstName
            if (object.LastName !== '')
                LastName = object.LastName
            if (object.SMS !== '')
                SMS = object.SMS
            if (object.Email !== '')
                Email = object.Email
            if (object.Phone !== '')
                Phone = object.Phone
            if (object.UserName !== '')
                UserName = object.UserName
            if (object.Password !== '')
                Password = object.Password
            if (object.add) {
                docName = object.document
                Dock = object.add;
            }
            let newObj = new RenterObject(UserID, FirstName, LastName, SMS, Email, Phone, 3, UserName, Password, Dock, docName);
            
            object = newObj

        }
        else if (type === 'Delete') {
            const con = window.confirm('למחוק שוכר?')
            if (con === false)
                return;
            object = { id: object.UserID }
        }
        const res= await CommonFunctions(type, object, path)
        let list = await GetFunction('Renter/GetAllRenters')
                this.props.setRenters(list !== null ? list : [])
               
                list=await GetFunction('User/GetAllDocuments')
                this.props.setDocuments(list !== null ? list : []) 
                this.setState({red:<Redirect to={{pathname:'/RedirectTo',redirect:'/Renter'}}/>})
           return res
        // if (res && res !== null) {
        //     this.closeFormModal();
        // }
    }

    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'שוכרים')
            LinksForTable = [<button type='button' onClick={() => { 
                this.setState({ ObjectsArray: this.props.rentersList, name: 'שוכרים',
                fieldsToSearch: [{ field: 'FirstName', name: 'שם פרטי', type: 'text' }, { field: 'LastName', name: 'שם משפחה', type: 'text' },
                { field: 'SMS', name: 'SMS', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'text' }],
                 }) }}>חזרה לשוכרים</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                            fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                            setForForm={this.setForForm}
                            validate={this.validate} />
                })
            }} >הוספת שוכר </button>,
            <button type='button'  onClick={async() => {
                const con = window.confirm('לשלוח?')
                if (con === true) {
                    let res;
                   res=await GetFunction('User/SendAllRenter')
                
                    if (res)
                        alert("נשלח")
                    else
                        alert("תקלה... לא נשלח")
                }
            }}>שליחת שם משתמש וסיסמא לכל השוכרים</button>]
        return { LinksForTable }





    }
    setForForm = object => {
        const fieldsToAdd = [{ field: 'document', name: 'מסמכים', type: 'file', index: 'end' }]
        let LinksPerObject = []
        const docks=this.props.documents.filter(i=>i.type===4 && i.DocUser===object.UserID)
        if (docks && docks[0]) {
 
            LinksPerObject.push (<div index='end'>{docks.map((dock, index) => 
            <button index='end' type='button' key={index} onClick={async() => {
                 const b=window.confirm('למחוק מסמך?')
                if(b)
                {
                await CommonFunctions('Delete',dock,'User/DeleteUserDocument') 
              let  list=await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : []) 
                }
 }}> מחיקת מסמך {DocName(dock.DocName)}</button>)}</div>)
         }
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {

      //  postFunction('Renter/getPropertiesbyRenterID', { id: object.OwnerID }).then(res => this.setState({ properties: res }))
      const rentals=this.props.rentalsList.filter(i=>i.UserID===object.UserID)
      let properties=[]
      rentals.map(item=>{properties.push(...this.props.propertiesList.filter(i=>i.PropertyID===item.PropertyID)) })
     
        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let fieldsToAdd = [];
        let LinksForEveryRow = [<Link
            to={{ pathname: '/Properties', objects: properties }}>דירות ששוכר</Link>]
        //postFunction('User/GetUserDocuments', { id: object.UserID, type: 4 }).then(res => this.setState({ docks: res }))
        const docks=this.props.documents.filter(i=>i.type===4 && i.DocUser===object.UserID)
       
        if (docks && docks[0]) {
         fieldsToAdd = [{ field: 'doc', name: 'מסמכים', type: 'file', index: 'end' } ] 
         object.doc = docks.map((dock, index) => <button className="button-file2" type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{DocName(dock.DocName)}</button>)
         }
        return {
            fieldsToAdd, LinksForEveryRow, object,
            ButtonsForEveryRow, LinksPerObject
        }
    }
    rend = () => {


        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            return <div> <Details Object={this.props.object} isOpen={this.props.isOpen} closeModal={this.props.closeModal}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                LinksForEveryRow={some.LinksForEveryRow}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
            /></div>

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
        else {

            return <div><Table name={this.state.name} fieldsArray={this.state.fieldsArray} objectsArray={this.state.ObjectsArray}
                setForTable={this.setForTable} setForForm={this.setForForm}
                set={this.set} delObject={this.submit}
                validate={this.validate} erors={this.state.erors} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />{this.state.showSomthing}{this.state.red}</div>
        }
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

export default connect (mapStateToProps,mapDispatchToProps)(Renter);
// export const rentersList = [{ UserID: 1, FirstName: 'aaa', LastName: 'asd', Phone: '000', Email: 'acd' },
// { UserID: 2, FirstName: 'aaa', LastName: 'aaz', Phone: '000', Email: 'acd' },
// { UserID: 3, FirstName: 'aaa', LastName: 'ard', Phone: '000', Email: 'acd' }]
// GetFunction('Renter/GetAllRenters');