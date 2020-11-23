import React, { Component } from 'react'
import Table from '../General/Table'
import Details from '../General/Details'
import Form from '../General/Form'
import AddCommonLinks from '../General/AddCommonLinks'
import MPropertyForRenterain1 from './PropertiesForRenter/PropertyForRenter';
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from "../Axios";
import { CommonFunction, CommonFunctions, GetFunction, postFunction, SearchFor } from '../General/CommonFunctions';
import PropertyOwnerObject from '../../Models-Object/PropertyOwnerObject';
import { mapStateToProps,mapDispatchToProps } from '../Login/Login'
import { connect } from 'react-redux'
import { Properties } from './Properties/Properties'
import RedirectTo from "../RedirectTo";
import fileDownload from 'js-file-download';
import './PropertyOwner.css'


export class PropertyOwner extends Component {
    // obj = []
    // componentDidMount = () => {

    //     Axios.get('PropertyOwner/getAllOwners').then(res => { this.obj = res.data })
    // }
    state = {

        name: 'משכירים',
        fieldsArray: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
        { field: 'Phone', name: 'טלפון', type: 'tel', pattern: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g },
        { field: 'Email', name: 'אימייל', type: 'email' }],
        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.ownersList,
       fieldsToSearch:[{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
       { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
       { field: 'Phone', name: 'טלפון', type: 'text',},
       { field: 'Email', name: 'אימייל', type: 'text' }],
        showForm: false,
        showDetails: false,
        showSomthing: null,
        docks: null,
        properties: null,
        red:null

        // fieldsToSearch: [{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
        // { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' }, { field: 'Phone', name: 'טלפון', type: 'tel' }, { field: 'Email', name: 'אימייל', type: 'email' }],
    }
    closeDetailsModal = () => {

        this.setState({ showSomthing: null })
    }
    closeFormModal = () => {

        this.setState({  showSomthing: null })
        
    }
    submitSearch =async (object) => {
     
        const path = 'PropertyOwner/Search';

        if (object) {
               
            let objects =await SearchFor(object, path)
            let name = 'תוצאות חיפוש'
            if (objects)
            {
            if (objects.length ===0 ) {
                name = 'לא נמצאו תוצאות'    
            }
            this.setState({ObjectsArray:[]})
            const objArray=[...objects]
            this.setState({ ObjectsArray: objArray, name:name,fieldsToSearch:null })
            }
        }
    }
    submit = async (type, object) => {

        let path = 'PropertyOwner/' + type + 'PropertyOwner';

        if (type === 'Add' || type === 'Update') {
            let OwnerID = object.OwnerID, OwnerFirstName = null, OwnerLastName = null, Phone = null, Email = null, Dock = null, docName = null

            if (type === 'Add')
                OwnerID = 1
            if (object.OwnerFirstName !== '')
                OwnerFirstName = object.OwnerFirstName
            if (object.OwnerLastName !== '')
                OwnerLastName = object.OwnerLastName
            if (object.Phone !== '')
                Phone = object.Phone
            if (object.Email !== '')
                Email = object.Email
            if (object.add !== '') {
                docName = object.document
                Dock = object.add;

            }
           
            object = new PropertyOwnerObject(OwnerID, OwnerFirstName, OwnerLastName, Phone, Email, Dock, docName)



        }
        else if (type === 'Delete') {
            const con = window.confirm('למחוק משכיר?')
            if (con === false)
                return;
            object = { id: object.OwnerID }
        }
        const res= await CommonFunctions(type, object, path)
     let list = await GetFunction('PropertyOwner/getAllOwners')
                this.props.setOwners(list !== null ? list : [])
                
                list=await GetFunction('User/GetAllDocuments')
                this.props.setDocuments(list !== null ? list : []) 
                this.setState({red:<Redirect to={{pathname:'/RedirectTo',redirect:'/PropertyOwner'}}/>})
        return res
        // if (res!==null) {
        //     this.closeFormModal();
        // }
    }



    validate = object => {
        let isErr = false
        let erors = []
        this.state.fieldsArray.map(field => { erors[field.field] = "" })
        let generalEror = ''
        if((object.OwnerFirstName===undefined || object.OwnerFirstName==='' ) && (object.OwnerLastName===undefined || object.OwnerLastName==='' ))
        {
            generalEror = 'חובה להכניס שם או שם משפחה'
            isErr = true
        }
        if (!((object.Phone && object.Phone !== '') || (object.Email !== '' && object.Email))) {
            generalEror = 'חובה להכניס אימייל או טלפון'
            isErr = true
        }

        return { isErr: isErr, generalEror: generalEror, erors: erors }

    }
    setForTable = () => {
        let LinksForTable = []

        if (this.state.name !== 'משכירים')
            LinksForTable = [<button type='button' type='button' onClick={() => { 
                this.setState({ ObjectsArray: this.props.ownersList, name: 'משכירים' ,
                fieldsToSearch:[{ field: 'OwnerFirstName', name: 'שם פרטי', type: 'text' },
                { field: 'OwnerLastName', name: 'שם משפחה', type: 'text' },
                { field: 'Phone', name: 'טלפון', type: 'text',},
                { field: 'Email', name: 'אימייל', type: 'text' }],}) }}>חזרה למשכירים</button>]
        else
            LinksForTable = [<button type='button' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing: <Form closeModal={this.closeFormModal} isOpen={this.state.showForm}
                        fieldsArray={this.state.fieldsArray} Object={{}} submit={this.submit} type='Add' name=' הוספת'
                        setForForm={this.setForForm}
                        validate={this.validate} />
                })
            }} > הוספת משכיר</button>]
        return {
            LinksForTable,

        }
    }
    setForForm = object => {
        const fieldsToAdd = [{ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }]
        const LinksPerObject = []
        const docks=this.props.documents.filter(i=>i.type===2 && i.DocUser===object.OwnerID)
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
    set =(object) => {

        //let properties = null
        let fieldsToAdd = []
        let ButtonsForEveryRow = []
        let LinksPerObject = []
        
       //postFunction('PropertyOwner/', { id: object.OwnerID}).then(res =>{ this.setState({ properties: res })})
       const properties=this.props.propertiesList.filter(i=>i.OwnerID
        ===object.OwnerID)
     //this.setState({properties: await postFunction('PropertyOwner/', { id: object.OwnerID})})
       // let res = this.state.properties
        // res = res !== null ? res : [];
        let LinksForEveryRow = [<Link 
            to={{
                pathname: '/Properties', objects: properties!== null ?properties  : []
               
            }} >דירות</Link>]
            
        //postFunction('User/GetUserDocuments', { id: object.OwnerID, type: 2 }).then(res => {this.setState({ docks: res });})    
       //this.setState({docks: await postFunction('User/GetUserDocuments', { id: object.OwnerID, type: 2 })})
       const docks=this.props.documents.filter(i=>i.type===2 && i.DocUser===object.OwnerID)
       
       if (docks && docks[0]) {
        fieldsToAdd = [{ field: 'doc', name: 'מסמכים', type: 'file', index: 'end' } ] 
        object.doc = docks.map((dock, index) => <button className="button-file" type='button' key={index} onClick={() => { window.open(dock.DocCoding)}}>{DocName(dock.DocName)}</button>)
        }
        return {
            fieldsToAdd, LinksForEveryRow, object,
            ButtonsForEveryRow, LinksPerObject
        }
    }
    rend = () => {

        if (this.props.type === 'details') {
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
                validate={this.validate} submit={this.submit} submitSearch={this.submitSearch}
                fieldsToSearch={this.state.fieldsToSearch} />
                {this.state.showSomthing}{this.state.red}</div>
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

export default connect (mapStateToProps,mapDispatchToProps)(PropertyOwner);
export const DocName=(docName)=>
{
    let name=docName.substring(docName.lastIndexOf('\\')+1)
     return name.substring(0,name.lastIndexOf('.'));
}
//export const ownersList =
    //GetFunction('PropertyOwner/getAllOwners')
    // [{ OwnerID: 1, OwnerFirstName: 'aaa', OwnerLastName: 'asd', Phone: '000', Email: 'acd' },
    // { OwnerID: 2, OwnerFirstName: 'aaa', OwnerLastName: 'aaz', Phone: '000', Email: 'acd' },
    // { OwnerID: 3, OwnerFirstName: 'aaa', OwnerLastName: 'ard', Phone: '000', Email: 'acd' }];
