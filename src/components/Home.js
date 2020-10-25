import React, { Component } from 'react';
import { Link, Redirect, Route} from 'react-router-dom';
import {connect } from 'react-redux'
import UserObject from '../Models-Object/UserObject'
import TasksPopUp from "./Individual/TasksPopUp";
import Axios from 'axios';
import Sign_up from "./Sign_up";
import Calendar from "./Calendar";
import Tasks from "./Individual/Tasks";
import EventDetails from "./EventDetails";
import Login from "./Login";
import Properties from "./Individual/Properties";
import PropertyForRenter from "./Individual/PropertyForRenter";
import PropertyOwner,{ownersList} from "./Individual/PropertyOwner";
import SubProperties from "./Individual/SubProperties";
import Details from "./General/Details";
import Form from "./General/Form";
import Rentals from "./Individual/Rentals";
import Renter from "./Individual/Renter";
//import Router from "./Router";



export class Home extends Component {
  state = {
    showt: false,
    use1: new UserObject(1, 'aa', 'bb', null, null, null, 3)
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
    var dataToSend = JSON.stringify({ param1: "value1", param2: "value2" });

    return (

      <div>
        {/* כל ארבעת השורות הללו לא צריך להתייחס בעיצוב כי זה רק בשביל שתוכלי לראות*/}
        <button onClick={() => { this.props.setUser(use1); }}>משתמש שוכר</button>
        <button onClick={() => { this.props.setUser(use2); }}>משתמש מזכירה</button>
                <Link to="Login"><button >כניסה</button></Link>
                <Link to="/PropertyForRenter"><button >דירות כניסה</button></Link>





<Link to={{ pathname: '/PropertyOwner', objects:ownersList }}><button >משכירים</button></Link>
        <Link to={{ pathname: '/Properties', objects: this.authorization }}> <button>נכסים</button></Link> 
        <Link to={{ pathname: '/Renter', objects: this.authorization }}> <button >שוכרים</button></Link>
        <Link to="/Calendar"><button >יומן</button></Link>
        <Link to="/Tasks"> <button>משימות</button></Link>
        <Link to={{ pathname: '/Rentals', authorization: this.authorization }}><button>השכרות</button></Link>
        <Link to=""><button >דף הבית</button></Link>


        <switch>
        <Route path="/Home" component={Home} />
        <Route path="/signup" component={Sign_up} />
        <Route path="/Calendar" component={Calendar} />
        <Route path='/EventDetails/:id' exact strict component={EventDetails} />
        <Route path="/login" component={Login} />
        <Route path='/Properties' component={Properties} />
        <Route path='/PropertyOwner' component={PropertyOwner} />
        <Route name="propertyForRenter" path='/PropertyForRenter' component={PropertyForRenter} />
        <Route path='/Rentals' component={Rentals} />
        <Route path='/Tasks' component={Tasks} />
        <Route path='/SubProperties' component={SubProperties} />
        <Route path='/Form' component={Form} />
        <Route path='/Renter' component={Renter} />
         <Route path='/Route' component={Route} /> 

        <Route path='/Details' component={Details}></Route>
        </switch>
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


