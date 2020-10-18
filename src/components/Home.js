import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import UserObject from '../Models-Object/UserObject'
import TasksPopUp from "./Individual/TasksPopUp";
import Axios from 'axios';

export class Home extends Component {
  state = {
    showt: false
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
        console.log('running every minute 1, 2, 4 and 5');
        this.setState({ showt: true })

      });

    }

    const use1 = new UserObject(1, 'aa', 'bb', null, null, null, 3);
    const use2 = new UserObject(1, 'aa', 'bb', null, null, null, 1);
    return (

      <div>
        <button onClick={() => { Axios.get('https://localhost:44368/api/Task/GetAllTasks').then(res => { console.log(res.data) }) }}>get function</button>
        <button onClick={() => { Axios.post('https://localhost:44368/api/User/AddUser', new Object(use1), { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => { console.log(res.data) }) }}>post with object</button>
        <button onClick={() => { Axios.post('https://localhost:44368/api/Renter/getRentalsbyRenterID', 1).then(res => { console.log(res.data) }) }}>post with int</button>
        <button onClick={() => { this.props.setUser(use1); }}>set user-renter</button>n
        <button onClick={() => { this.props.setUser(use2); }}>set user-manager</button>
        <Link to={{ pathname: '/PropertyOwner', authorization: this.authorization }}><button >משכירים</button></Link>
        <Link to={{ pathname: '/Properties', authorization: this.authorization }}> <button>נכסים</button></Link>
        <Link to={{ pathname: '/Renter', authorization: this.authorization }}> <button >שוכרים</button></Link>
        <Link to="/Calendar"><button >יומן</button></Link>
        <Link to="/Tasks"> <button>משימות</button></Link>
        <Link to={{ pathname: '/Rentals', authorization: this.authorization }}><button>השכרות</button></Link>
        <Link to="/PropertyForRenter"><button >דירות כניסה</button></Link>
        <Link to="Login"><button >כניסה</button></Link>
        <Link to=""><button >דף הבית</button></Link>
        {i()}
        {this.state.showt && <TasksPopUp isOpen={this.state.showt} closeModal={this.closeModel} />}
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


