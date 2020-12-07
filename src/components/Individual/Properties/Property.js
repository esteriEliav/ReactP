import React, { Component, PureComponent } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom';
import Details from '../../General/Details/Details';
import { CommonFunctions, GetFunction, postFunction } from '../../General/CommonAxiosFunctions';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import SubProperties from '../SubProperties/SubProperties';
import Rental from '../Rentals/Rental';
import { PropertyTable } from './PropertyTable'
import PropertyForm from './PropertyForm'
import * as Action from '../../General/Action'
import './Properties.css';
import PropertyOwner from '../PropertyOwner/Owner';


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
export class Property extends PureComponent {
    comp = () => {
        const owners = this.props.ownersList.filter(i => i.status === true).map(item => {
            let name = item.OwnerFirstName !== null ? item.OwnerFirstName : '';
            name += item.OwnerLastName !== null ? ' ' + item.OwnerLastName : ''
            return { id: item.OwnerID, name: name }
        })

        let fieldsArray = [...this.state.fieldsArray];
        fieldsArray.find(i => i.field === 'OwnerID').selectOptions = owners;
        this.setState({ fieldsArray });
    }
    componentWillMount = () => {
        this.comp()
    }
    componentDidUpdate = (prevProps, prev) => {
        if (JSON.stringify(prevProps.ownersList) != JSON.stringify(this.props.ownersList)) {
            this.comp()
        }
    }
    state = {
        fieldsArray: [{ field: 'PropertyID', name: 'קוד דירה', type: 'text' }, { field: 'OwnerID', name: 'בעלים', type: 'select', selectOptions: [], required: true },
        { field: 'CityID', name: 'עיר', type: 'select', selectOptions: this.props.cities ? [...this.props.cities] : [], required: true }, { field: 'StreetID', name: 'רחוב', type: 'select', selectOptions: [], required: true, index: 1 },
        { field: 'Number', name: 'מספר', type: 'text', required: true, pattern: '[1-9][0-9]*[A-Ca-cא-ג]?' }, { field: 'Floor', name: 'קומה', type: 'number', required: true },
        { field: 'ApartmentNum', name: 'מספר דירה', type: 'number' }, { field: 'Size', name: 'שטח', type: 'text' }, { field: 'RoomsNum', name: 'מספר חדרים', type: 'text' },
        { field: 'IsDivided', name: 'מחולק?', type: 'checkbox' }, { field: 'ManagmentPayment', name: 'דמי ניהול', type: 'text' }, { field: 'IsPaid', name: 'שולם?', type: 'checkbox' },
        { field: 'IsExclusivity', name: 'בלעדי?', type: 'checkbox' }, { field: 'IsWarranty', name: 'באחריות?', type: 'checkbox' }, { field: 'IsInsured', name: 'מבוטח?', type: 'checkbox' }
        ],
        showsomthing: null,
        showExtention: null,
        exclusivityPeople: this.props.exclusivityPeople ? this.props.exclusivityPeople : [],
        red: null,
    }
    //סוגרת חלונית מסוג דיטיילס
    closeActionsModal = () => {

        this.setState({ showActions: null })
    }
    //סוגרת חלונית מסוג פורם
    showModal = (show) => {
        this.setState({ showsomthing: show })
    }
    closeModal = () => {

        this.setState({ showsomthing: null })
    }
    showExtentionModal = (show) => {
        this.setState({ showExtention: show })
    }
    closeExtentionModal = () => {

        this.setState({ showExtention: null })

    }
    //פונקציה להוספת דברים הקשורים לקומפוננטת טייבל

    //באטן להוספת משכיר (ירונדר בפורם)


    UpdateAfterAction = async (res) => {
        let list = await GetFunction('Property/GetAllProperties')
        this.props.setProperties(list !== null ? list : [])
        list = await GetFunction('User/GetAllDocuments')
        this.props.setDocuments(list !== null ? list : [])
        this.redirect()
        return res
    }
    redirect = () => {
        this.setState({ red: <Redirect to={{ pathname: '/RedirectTo', redirect: '/Properties' }} /> })
    }
    //פונקציה שמוסיפה ומשנה דברים שקשורים לתצוגת אוביקט (גם באוביקט עצמו וגם באטנים ושדות שקשורים אליו)
    set = (object) => {    //הפונקציה ממפה את כל השדות של האוביקט והופכת איידי לשם ואת המפתחות זרים לקישורים

        let LinksPerObject = []
        let ButtonsForEveryRow = []
        let tempobject = { ...object };
        let fieldsToAdd = []
        if (parseInt(object.StreetID)) {
            const street = this.props.streets.find(i => i.CityId === object.CityID && i.StreetID == object.StreetID)

            tempobject.StreetID = street.StreetName
        }
        if (parseInt(object.CityID)) {
            const city = this.props.cities.find(i => i.id === object.CityID)
            tempobject.CityID = city.CityName
        }

        fieldsToAdd.push({ field: 'IsRented', name: 'מושכר', type: 'checkbox', index: 8 })
        const rentalObject = this.props.rentalsList.find(i => i.PropertyID === object.PropertyID && i.status === true)

        //אם הדירה מושכרת
        if (object.IsRented && rentalObject) {


            // יהיה קישור באוביקט עצמו לפרטי ההשכרה
            tempobject.IsRented = <Link onClick={() => {
                this.setState({ showDetails: true })
                this.setState({
                    showsomthing: <Rental
                        {...this.props}
                        closeModal={this.closeModal}
                        object={rentalObject}
                        type={Action.details}

                    />
                })
            }}//במקום הוי אמורים לשים אייקון שמסמל כן
            >V</Link>

            //באטן לעריכת ההשכרה
            LinksPerObject.push(<button index={7} type='button' onClick={() => {
                debugger
                this.setState({
                    showsomthing: <Rental
                        {...this.props}
                        type={Action.form}
                        formType={Action.Update}
                        formName='ערוך השכרה'
                        closeModal={this.closeModal}
                        object={rentalObject}
                    />
                })

            }}>ערוך השכרה</button>)
        }
        //אחרת, אם לא מושכרת
        else {

            tempobject.IsRented = 'X'//במקום האיקס אמורים לשים אייקון שמסמל לא
            //באטן להוספת השכרה
            LinksPerObject.push(<button type='button' index={7} onClick={() => {
                this.setState({
                    showsomthing: <Rental
                        {...this.props}
                        type={Action.form}
                        formType={Action.Add}
                        formName='הוסף השכרה'
                        closeModal={this.closeModal}

                    />
                })
            }}>הוסף השכרה</button>)
        }
        //אםהנכס מחולק לכמה נכסים
        if (object.IsDivided) {
            const spobjects = this.props.SubPropertiesList.filter(i => i.SubPropertiesID === object.SubPropertiesID)
            //לינק לטבלה המציגה את כל הנכסים המחולקים שלו
            tempobject.IsDivided = <Link
                to={{ pathname: '/SubProperties', objects: spobjects, PropertyID: object.PropertyID }}>V</Link>//במקום הוי אמורים לשים אייקון שמסמל כן
            //באטן להוספת תת נכס
            LinksPerObject.push(<button type='button' index={9} onClick={() => {
                this.setState({
                    showsomthing: <SubProperties
                        type={Action.form}
                        closeModal={this.closeModal}
                        formType={Action.Add}
                        formName='הוסף נכס מחולק'
                        object={{ PropertyID: object.PropertyID }} />
                })
            }} >הוסף-נכס-משנה</button>)
        }

        else
            tempobject.IsDivided = 'X'//במקום האיקס אמורים לשים אייקון שמסמל לא
        //אם הדירה בלעדית
        if (object.IsExclusivity) {
            tempobject.IsExclusivity = 'V'
            //שדה של אחראי בלעדיות של הדירה
            fieldsToAdd.push({ field: 'ExclusivityID', name: 'אחראי בלעדיות', type: 'select', selectOptions: this.props.exclusivityPeople ? [...this.props.exclusivityPeople] : [], index: 12 })

            if (object.ExclusivityID)
                tempobject.ExclusivityID = this.state.exclusivityPeople.find(i => i.id === object.ExclusivityID).name
        }
        else
            tempobject.IsExclusivity = 'X'
        if (object.IsWarranty)
            tempobject.IsWarranty = 'V'
        else
            tempobject.IsWarranty = 'X'

        if (object.Isinsured)
            tempobject.IsInsured = 'V'
        else
            tempobject.IsInsured = 'X'
        //בשדה משכיר ,באטן לפרטי משכיר
        const ownerobject = this.props.ownersList.find(i => i.OwnerID === object.OwnerID)
        if (ownerobject) {
            let ownerName = ownerobject.OwnerFirstName !== null ? ownerobject.OwnerFirstName : '';
            ownerName += ownerobject.OwnerLastName ? ' ' + ownerobject.OwnerLastName : ''
            tempobject.OwnerID = (<Link onClick={() => {
                this.setState({
                    showsomthing: <PropertyOwner
                        closeModal={this.closeModal}
                        object={ownerobject}
                        type={Action.details}
                    />
                })
            }}>{ownerobject && ownerName} </Link>)
        }
        //מחזירה אוביקט:
        //fieldsToAdd- שדות נוספים הקשורים לאוביקט
        //LinksForEveryDetails:לינקים שיש להוסיף בהצגת האוביקט (בקומפוננטת דיטיילס)
        //ButtonsForEveryRow:באטנים שיש להוסיף לכל שורה בטבלה
        //object- האוביקט לאחר השינויים שנעשו בו
        //LinksPerObject: באטנים ולינקים הקשורים לאוביקט

        return {
            fieldsToAdd, ButtonsForEveryRow, object: tempobject, LinksPerObject
        };



    }
    docks = (object) => {
        return this.props.documents.filter(i => i.type === 1 && i.DocUser === object.PropertyID)
    }
    //פונקציה הבוחרת מה לרנדר  בהתאם לטייפ שנשלח אליה
    rend = () => {
        let whatToRender = []
        // מציג פרטים של אוביקט מסוים מסוג נכס 
        if (this.props.type === 'details') {
            const some = this.set(this.props.object)
            whatToRender.push(<Details
                closeModal={this.props.closeModal}
                Object={some.object}
                fieldsArray={this.state.fieldsArray}
                LinksPerObject={some.LinksPerObject}
                ButtonsForEveryRow={some.ButtonsForEveryRow}
                fieldsToAdd={some.fieldsToAdd}
                docks={this.docks}
            />)
        }
        //מציג הוספה או עריכה של אוביקט מסיג נכס
        else if (this.props.type === 'form') {
            let fieldsArray = [...this.state.fieldsArray];
            fieldsArray.splice(0, 1)
            whatToRender.push(<PropertyForm
                closeFormModal={this.props.closeModal}
                object={this.props.object}
                formName={this.props.formName}
                formType={this.props.formType}
                fieldsArray={fieldsArray}
                UpdateAfterAction={this.UpdateAfterAction}
                showModal={this.showModal}
                closeModal={this.closeModal}
                showExtentionModal={this.showExtentionModal}
                closeExtentionModal={this.closeExtentionModal}
                exclusivityPeople={this.state.exclusivityPeople}
                redirect={this.redirect}
                docks={this.docks}
            />)
        }
        //אם לא נשלח טייפ תוצג הטבלה של כל הנכסים
        else {
            whatToRender.push(
                <PropertyTable
                    {...this.props}
                    fieldsArray={this.state.fieldsArray}
                    set={this.set}
                    delObject={this.delObject}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    objectsArray={this.props.location && this.props.location.objects ? this.props.location.objects : this.props.propertiesList}
                    UpdateAfterAction={this.UpdateAfterAction}

                />

            )
        }
        whatToRender.push(this.state.showsomthing, this.state.showExtention, this.state.red)
        return whatToRender
    }
    render() {
        console.log('this.props-property', this.props)
        return (

            <div>
                {this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ?
                    this.rend()
                    : <Redirect to='/' />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Property))

