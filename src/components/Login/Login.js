import React, { Component, useReducer } from 'react';
import { CommonFunctions, GetFunction, postFunction } from '../General/CommonFunctions';
import UserDTO from '../../Models-Object/UserObject';
import { connect } from 'react-redux'
import { Link, Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';
import Popup from 'reactjs-popup';
import picLogin from '../../../src/pic-login.png';


import Axios from "../Axios"
//import Router from './Router';
import userDTO from '../../Models-Object/UserObject';
//const use1 = new userDto(1, 'aa', 'bb', null, null, null, 3);
//const use2 = new userDto(1, 'aa', 'bb', null, null, null, 1);
import './Login.css'



export class Login extends Component {
    use1 = new UserDTO(1, 'aa', 'bb', null, null, null, 3);
    use2 = new UserDTO(1, 'aa', 'bb', null, null, null, 1);
    state =
        {
            userName: '',
            password: '',
            redirect:true,
           

        }
    // componentDidMount = async () => {
    //     debugger;
    //    let list = await GetFunction('PropertyOwner/getAllOwners')
    //     this.props.setOwners(list !== null ? list : [])
    //      list = await GetFunction('Property/GetAllProperties')
    //     this.props.setProperties(list !== null ? list : [])
    //     list = await GetFunction('Rental/GetAllRentals')
    //     this.props.setRentals(list !== null ? list : [])
    //     list = await GetFunction('Renter/GetAllRenters')
    //     this.props.setRenters(list !== null ? list : [])
    //     list = await GetFunction('SubProperty/GetAllSubProperties')
    //     this.props.setSubProperties(list !== null ? list : [])
    //     list = await GetFunction('Task/GetAllTasks')
    //     this.props.setTasks(list !== null ? list : [])
    //     list = await GetFunction('Property/GetAllCities')
    //     this.props.setCities(list !== null ? list : [])
    //     list=await GetFunction('Property/GetAllStreets')
    //     this.props.setStreets(list !== null ? list : [])
    //     list=await GetFunction('User/GetAllDocuments')
    //      this.props.setDocuments(list !== null ? list : [])
    //     debugger;

    // }

    onSubmit = async (e) => {
        e.preventDefault();
        let user = await postFunction('User/Ifhaveuse',{ username:this.state.userName,passemail:this.state.password})
        if (user ) {
            
            new UserDTO()
            const userObj = new UserDTO(user.UserID,user.FirstName,user.LastName,user.SMS,user.Email,user.Phone,user.RoleID,user.userName,user.Password)
            let userName=userObj.FirstName!==null && userObj.FirstName;
            userName+=userObj.LastName!==null && ' '+userObj.LastName;
            alert(" ברוכים הבאים " + userName);
           let list = await GetFunction('Property/GetAllCities')
            this.props.setCities(list !== null ? list : [])
            list=await GetFunction('Property/GetAllStreets')
            this.props.setStreets(list !== null ? list : [])
            
            debugger
            if (userObj.RoleID === 3)
            {
               list = await postFunction('Renter/getPropertiesbyRenterID', { id: userObj.UserID })
                this.props.setProperties(list !== null ? list : [])
                this.props.setHome(true)
            }
            else {
            
                list = await GetFunction('Property/GetAllProperties')
                this.props.setProperties(list !== null ? list : [])
                list = await GetFunction('PropertyOwner/getAllOwners')
                this.props.setOwners(list !== null ? list : [])
                list = await GetFunction('Rental/GetAllRentals')
                this.props.setRentals(list !== null ? list : [])
                list = await GetFunction('Renter/GetAllRenters')
                this.props.setRenters(list !== null ? list : [])
                list = await GetFunction('SubProperty/GetAllSubProperties')
                this.props.setSubProperties(list !== null ? list : [])
                list = await GetFunction('Task/GetAllTasks')
                this.props.setTasks(list !== null ? list : [])
                list=await GetFunction('User/GetAllDocuments')
                this.props.setDocuments(list !== null ? list : []) 
                debugger
                
            }
            
            this.setState({ redirect:false})
            this.props.closeModal()
             this.props.setUser(userObj);
        }
        else
            alert("שם משתמש או סיסמה שגויים")
    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value });
    };

    render() {
        
        return (
            <Popup className="popup-login" open={this.state.redirect} closeOnDocumentClick={false} modal> <a className="close close-login" onClick={this.props.closeModal}>
            &times;
  </a>
           
            <form onSubmit={this.onSubmit} className="login-form">
            <div><img className="img-login" src={picLogin}></img> </div>
            <div className="login-text">
                <label className="login-item" htmlFor="user-name">שם משתמש</label>
                <input className="login-item input-field" type="text" name="user-name" value={this.state.userName} id="name" placeholder="שם משתמש" onChange={this.handleChange('userName')} />
                <label className="login-item" htmlFor="password">סיסמה </label>
                <input className="login-item input-field" type="password" name="password" value={this.state.password} id="password" placeholder="סיסמה" onChange={this.handleChange('password')} />
                <div className="login-item btn-enter">
                    <input className="login-button" type="submit" value="כניסה" />
                </div>
                <div className="login-item btn-forget">
                    {/* הקישור יפנה לדף של שחזור סיסמה */}
                    {/* <a href="@">שכחת סיסמה?</a> */}
                    {/*<a href="@">שכחת סיסמה?</a>*/}
                   שכחת סיסמה?<Link to="/signup" onClick={()=>this.props.closeModal()} >לחץ כאן</Link>
                   
                </div>
                </div></form> 
</Popup>


        )
    }
}



export const mapStateToProps = state => {
    return {
        ...state

    }
};
export const mapDispatchToProps = dispatch => {
    return {
        setUser: (userObject) => dispatch({ type: 'SET_USER', userObj: userObject }),
        setProperties: (propertiesList) => dispatch({ type: 'SET_PROPERTIES', propertiesList: propertiesList }),
        setOwners: (ownersList) => dispatch({ type: 'SET_OWNERS', ownersList: ownersList }),
        setRentals: (rentalsList) => dispatch({ type: 'SET_RENTALS', rentalsList }),
        setRenters: (rentersList) => dispatch({ type: 'SET_RENTERS', rentersList }),
        setSubProperties: (SubPropertiesList) => dispatch({ type: 'SET_SUBPROPERTIES', SubPropertiesList }),
        setTasks: (tasksList) => dispatch({ type: 'SET_TASKS', tasksList }),
        setCities: (cities) => dispatch({ type: 'SET_CITIES', cities }),
        setStreets: (streets) => dispatch({ type: 'SET_STREETS', streets }),
        setDocuments: (documents) => dispatch({ type: 'SET_DOCUMENTS', documents })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

