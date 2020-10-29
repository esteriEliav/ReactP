import React, { Component } from 'react';
import Login from './Login'
import Calendar from './Calendar'
import EventDetails from './EventDetails'
import Sign_up from './Sign_up'
import Form from './General/Form'
import Details from './General/Details'
import Properties from "./Individual/Properties";
import PropertyOwner from "./Individual/PropertyOwner";
import PropertyForRenter from "./Individual/PropertyForRenter";
import Rentals from "./Individual/Rentals";
import Tasks from "./Individual/Tasks";
import SubProperties from "./Individual/SubProperties";
import ReportForm from "./Individual/ReportForm";
import Renter from './Individual/Renter';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import UserObject from '../Models-Object/UserObject'
import TasksPopUp from "./Individual/TasksPopUp";
import Axios from 'axios';
import { postFunction } from './General/CommonFunctions';
import Select from "react-dropdown-select";





export class Home extends Component {
  state = {
    showt: false,
    use1: new UserObject(1, 'aa', 'bb', null, null, null, 3),
    a: null
  }
  closeModel = () => {
    this.setState({ showt: false })

  }
  authorization = () => {
    if (this.props.user.RoleID === 1 || this.props.user.RoleID === 2) {
      return null
    }
    return <Redirect to='/a' />
  }

  render() {
    var cron = require('node-cron');
    const i = () => {
      cron.schedule('* */30 * * * * ', () => {
        this.setState({ showt: true })

      });

    }

    const use1 = new UserObject(1, 'aa', 'bb', null, null, null, 3);
    const use2 = new UserObject(1, 'aa', 'bb', null, null, null, 1);


    return (

      <div>
        <p hidden={this.props.user.UserID === null}>{this.props.user.UserName}<Link onClick={() => { this.props.setUser(new UserObject()) }}>התנתק</Link></p>
        {/* <button onClick={() => { Axios.post('https://localhost:44368/api/PropertyOwner/Search', ({ OwnerFirstName: 'a', OwnerLastName: 'b', Phone: 'aaa', Email: 'qwer' })).then(res => { console.log(res.data) }) }} >search</button>
        <button onClick={() => {
          Axios.get('https://localhost:44368/api/Task/GetAllTasks').then(res => { console.log(res.data); })

        }}>get function</button>
        <button onClick={async () => {
          const r = await postFunction('User/AddUser', use1); console.log(new Date(r).toLocaleDateString()); console.log('r', r);
          ; debugger;
        }} >post with object</button>
        <button onClick={() => { Axios.post('https://localhost:44368/api/Renter/getRentalsbyRenterID', { id: 1 }).then(res => { console.log(res.data) }) }}>post with int</button> */}
        <nav hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}>
          <Link to={{ pathname: '/PropertyOwner' }}><button >משכירים</button></Link>
          <Link to={{ pathname: '/Properties' }}> <button>נכסים</button></Link>
          <Link to={{ pathname: '/Renter' }}> <button >שוכרים</button></Link>
          <Link to="/Calendar"><button >יומן</button></Link>
          <Link to="/Tasks"> <button>משימות</button></Link>
          <Link to={{ pathname: '/Rentals' }}><button>השכרות</button></Link>
          <Link to="/PropertyForRenter"><button >דירות כניסה</button></Link>
          <Link to="Login"><button >כניסה</button></Link>
          <Link to=""><button >דף הבית</button></Link>
        </nav>
        {i()}
        {this.state.showt && <TasksPopUp isOpen={this.state.showt} closeModal={this.closeModel} />}
        {this.props.user.UserID === null && <Login />}
        {this.props.user.RoleID === 3 && <PropertyForRenter />}
        <button onClick={() => { this.props.setUser(use1); }}>set user-renter</button>
        <button onClick={() => { this.props.setUser(use2); }}>set user-manager</button>

      </div>

    )
  }
}
const mapStateToProps = state => {

  return {
    user: state.user
  }
};
const mapDispatchToProps = dispatch => {

  return {
    setUser: (userObject) => dispatch({ type: 'SET_USER', userObj: userObject })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)


