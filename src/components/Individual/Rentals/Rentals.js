import React, { Component } from 'react'
import Table from '../../General/Table'
import { Link, Redirect } from 'react-router-dom';
import Axios from "../../Axios";
import Details from '../../General/Details';
import Renter from '../Renter/Renter';
import Properties from '../Properties/Properties';
import { CommonFunctions, GetFunction, postFunction, Search } from '../../General/CommonFunctions';
import RentalObject from '../../../Models-Object/RentalObject';
import { mapStateToProps,mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import Form from '../../General/Form'
import PropertyOwner,{DocName} from '../PropertyOwner';
import SubProperties from '../SubProperties';
import './Rentals.css';
import RedirectTo from "../../RedirectTo";

import fileDownload from 'js-file-download'


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
        { field: 'EndDate', name: 'תאריך סיום חוזה', type: 'date' }, { field: 'ContactRenew', name: 'לחדש חוזה?', type: 'checkbox' }],

        fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'Owner', name: 'שם משכיר', type: 'text' }, { field: 'User', name: 'שם שוכר ', type: 'text' },
        { field: 'EnteryDate', name: 'מתאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'עד תאריך סיום חוזה', type: 'date' }],

        ObjectsArray: this.props.location && this.props.location.objects ? this.props.location.objects : this.props.rentalsList,
        // [{ RentalID: 1, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-01-02', EndDate: '2019-12-02', ContactRenew: false },
        // { RentalID: 3, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }],//
        isAutho: true,//false
        showForm: this.props.type == 'form' ? true : false,
        showDetails: this.props.type == 'details' ? true : false,
        showSomthing: null,
        spobject: {},
        docks: [],
        owner: {},
        property: {},
        userObject: {},
        PaymentTypeOptions: [],
        red:null


    }
    componentWillMount =  () => {
      
        let PaymentTypeOptions1 = this.props.paymentTypes;
        
        PaymentTypeOptions1 = PaymentTypeOptions1 !== null ?
            PaymentTypeOptions1.map(item => { return { id: item.PaymentTypeID, name: item.PaymentTypeName } }) : [];
        const renters = this.props.rentersList.map(item => { return { id: item.OwnerID, name: item.OwnerFirstName + ' ' + item.OwnerLastName } })
        //const cities = this.props.cities
        
        let city;
        let street;
        const propertiesOptions = this.props.propertiesList.map(item => {
            //const street = await postFunction('Property/GetStreetByID', item.CityID);
           city=this.props.cities.find(i=>i.CityId===item.CityID)
            street=this.props.streets.find(i=>i.CityId===item.CityID && i.StreetID===item.StreetID)
            
            return { id: item.PropertyID, name: item.PropertyID + ':' + street.StreetName + ' ' + item.Number + ' ,' + city.CityName }
        })
        const PaymentTypeOptions=[...PaymentTypeOptions1]
         let fieldsArray1 = [...this.state.fieldsArray];
        fieldsArray1[0].selectOptions = propertiesOptions;
        fieldsArray1[1].selectOptions = renters;
        fieldsArray1[3].radioOptions = PaymentTypeOptions;
        
       this.setState({ fieldsArray:fieldsArray1, PaymentTypeOptions})
   
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

        if (object.RentPayment && object.RentPayment !== '' && (parseFloat(object.RentPayment).toString() !== object.RentPayment.toString())) {
            erors.RentPayment = 'נא להקיש סכום'
            isErr = true
        }
        if (object.EnteryDate > object.EndDate) {
            generalEror = 'תאריך כניסה מאוחר מתאריך יציאה'
            isErr = true
        }
        return { isErr: isErr, generalEror: generalEror, erors: erors }
    }
    submitSearch =async (object) => {
        const path = 'Rental/Search';

        if (object) {
            let objects =await Search(object, path)
            if (objects)
            {
            let name = 'תוצאות חיפוש'
            if (objects.length === 0) {
                name = 'לא נמצאו תוצאות'
            }
            this.setState({ ObjectsArray: objects, name,fieldsToSearch:null })
        }
        }
    }
    submit = async (type, object) => {
        let path = 'Rental/' + type + 'Rental'
        if (type === 'Add' || type === 'Update') {
           
            let newObj = RentalObject()
            if (type === 'Add') {
                newObj.RentalID = 1
               let property= this.props.propertiesList.find(i=>i.PropertyID===object.PropertyID)
               if(property)
               {
                if(property.IsRented!==true)
                {
                    property.IsRented=true;
                    postFunction('Property/UpdateProperty',property);
                }
            }
            }
            else
                newObj.RentalID = object.RentalID
             newObj.PropertyID = object.PropertyID
           newObj.SubPropertyID = object.SubPropertyID
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
            const con = window.confirm('למחוק השכרה?')
            if (con === false)
                return;
            object = { id: object.RentalID }

        }
      const res= await CommonFunctions(type, object, path)
      
             let   list = await GetFunction('Rental/GetAllRentals')
                this.props.setRentals(list !== null ? list : [])
                list = await GetFunction('Property/GetAllProperties')
                this.props.setProperties(list !== null ? list : [])
                list=await GetFunction('User/GetAllDocuments')
                this.props.setDocuments(list !== null ? list : []) 
                list=await GetFunction('Task/GetAllTasks')
                this.props.setTasks(list !== null ? list : []) 
                this.setState({red:<Redirect to={{pathname:'/RedirectTo',redirect:'/Rentals'}}/>})
      return res
        // if (res && res !== null) {
        //     this.closeFormModal();
        // }
    }

    //אמורה להיות פונקציה שממפה עבור כל איידי את השם

    setForTable = () => {
        let LinksForTable = []
        if (this.state.name !== 'השכרות')
            LinksForTable = [<button type='button' onClick={() => {
                 this.setState({ ObjectsArray: this.props.rentalsList, name: 'השכרות',
                 fieldsToSearch: [{ field: 'PropertyID', name: 'קוד נכס', type: 'text' }, { field: 'Owner', name: 'שם משכיר', type: 'text' }, { field: 'User', name: 'שם שוכר ', type: 'text' },
        { field: 'EnteryDate', name: 'מתאריך כניסה לדירה', type: 'date' },
        { field: 'EndDate', name: 'עד תאריך סיום חוזה', type: 'date' }], }) }}>חזרה להשכרות</button>]
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
        let LinksPerObject = [this.linkToAddRenter, this.linkToAddProperty]
        const docks=this.props.documents.filter(i=>i.type===3 && i.DocUser===object.RentalID)
        if (docks && docks[0]) {
 
            LinksPerObject.push (<div index='end'>{docks.map((dock, index) => {
               
          return  <button index='end' type='button' key={index} onClick={async() => {
                const b=window.confirm('למחוק מסמך?')
                if(b)
                {
                await CommonFunctions('Delete',dock,'User/DeleteUserDocument') 
              let  list=await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : []) 
                }
        }}> מחיקת מסמך {DocName(dock.DocName)}</button>})}</div>)
         }
        const fieldsToAdd = [{ field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }]
        
        return { fieldsToAdd, LinksPerObject }
    }
    set = (object) => {
        
        
        
        let LinksPerObject = []
        let LinksForEveryRow = []
        let ButtonsForEveryRow = []
      let  tempObject={...object}
        let fieldsToAdd = []
        //postFunction('Property/GetPropertyByID', { id: object.PropertyID }).then(res => this.setState({ property: res }))
        const property=this.props.propertiesList.find(i=>i.PropertyID===object.PropertyID)
        
        //postFunction('PropertyOwner/GetOwnerByID', { id: this.state.property.OwnerID }).then(res => this.setState({ owner: res }))
        const ownerObject=this.props.ownersList.find(i=>i.OwnerID===property.OwnerID)

        //postFunction('Renter/GetRenterByID', { id: object.UserID }).then(res => this.setState({ userObject: res }))
        const userObject=this.props.rentersList.find(i=>i.UserID===object.UserID)
        
        
        tempObject.PropertyID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Properties type='details' object={property !== null ? property : {}}
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}
    
    
        >{object.PropertyID}</Link>

        LinksPerObject.push(<button type='button' index={0} onClick={() => {
            this.setState({
                showForm: true, showSomthing:
                    <Properties type='form' formType='Update' formName='עריכה' index={0} object={property}
                        isOpen={this.state.showForm} closeModal={this.closeFormModal} />
            })
        }}>
            ערוך פרטי נכס</button>)

        
        
        if(userObject)
        {
        let renterName=userObject.FirstName!==null?userObject.FirstName:'';
        renterName+=userObject.LastName!==null?' '+userObject.LastName:'';
        tempObject.UserID = <Link onClick={() => {
            this.setState({
                showDetails: true, showSomthing:
                    <Renter type='details' object={userObject !== null ? userObject : {}}
                        isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} />
            })
        }}>
            {userObject && renterName}</Link>
        }
         
         if(object.EnteryDate)
       tempObject.EnteryDate = new Date(object.EnteryDate).toLocaleDateString();
       if(object.EndDate)
        tempObject.EndDate = new Date(object.EndDate).toLocaleDateString();
        
        if(object.PaymentTypeID && this.state.PaymentTypeOptions.length>0)
        {          
        const PaymentType = this.state.PaymentTypeOptions.find(i => i.id === object.PaymentTypeID);
        tempObject.PaymentTypeID = PaymentType.name
    }
    if(object.ContactRenew)
    tempObject.ContactRenew='V'
    else
    tempObject.ContactRenew='X'
        if(ownerObject)
        {
        let ownerName=ownerObject.OwnerFirstName !==null?': '+ownerObject.OwnerFirstName :'';
        ownerName+=ownerObject.OwnerLastName!==null?' '+ownerObject.OwnerLastName:'';
        LinksPerObject.push(<button type='button' index='end' onClick={() => {
            this.setState({
                showDetails: true, showSomthing: <PropertyOwner object={ownerObject}
                    type='details' isOpen={this.state.showDetails} closeModal={this.closeDetailsModal} 
                    propertiesList={this.props.propertiesList}
                    documents={this.props.documents}/>
            })
        }}
        >משכיר{ownerName}</button>,

            <button type='button' index='end' onClick={() => {
                this.setState({ showForm: true })
                this.setState({
                    showSomthing:
                        <PropertyOwner type='form' formType='Update' formName='עריכה'
                            object={ownerObject} isOpen={this.state.showForm} closeModal={this.closeFormModal} />
                })
            }}>
                ערוך משכיר </button>)
        }
         
       
        //postFunction('User/GetUserDocuments', { id: object.RentalID, type: 3 }).then(res => this.setState({ docks: res }))
        if (object.SubPropertyID !== null) {
            // postFunction('SubProperty/GetSubPropertyByID', { id: object.SubPropertyID }).then(res => this.setState({ spobject: res }))
            const spobject=this.props.SubPropertiesList.find(i=>i.SubPropertyID===object.SubPropertyID)
            LinksPerObject.push(<button type='button' index='end' onClick={() => {
                 this.setState({ showDetails: true })
                 this.setState({
                     showSomthing:
                         <SubProperties isOpen={this.state.showDetails} closeModal={this.closeDetailsModal}
                             object={spobject}
                             type='details' />
                 })
             }} >פרטי נכס מחולק </button>)
 
         }
        const docks=this.props.documents.filter(i=>i.type===3 && i.DocUser===object.RentalID)
       
       if (docks && docks[0]) {
        fieldsToAdd = [{ field: 'doc', name: 'מסמכים', type: 'file', index: 'end' } ] 
        tempObject.doc = docks.map((dock, index) => <button type='button' key={index} onClick={() => { fileDownload(dock.docCoding,DocName(dock.DocName)) }}>{DocName(dock.DocName)}</button>)
        }
        return {
            fieldsToAdd, LinksForEveryRow,
            ButtonsForEveryRow, object:tempObject, 
            LinksPerObject
        };

    }
    rend = () => {
        ;
        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            
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
                fieldsToSearch={this.state.fieldsToSearch} ></Table>{this.state.showSomthing}{this.state.red}</div>

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

export default connect (mapStateToProps,mapDispatchToProps)(Rentals)



//export const rentalsList = [{ RentalID: 1, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '1/02/2018', EndDate: '1/02/2019', ContactRenew: false },
//{ RentalID: 3, PropertyID: 1, UserID: 5, RentPayment: 2500, PaymentTypeID: 2, EnteryDate: '2018-02-01', EndDate: '2019-05-03', ContactRenew: true }];
//res = await GetFunction('Rental/GetAllRentals') ;
