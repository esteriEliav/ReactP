import React, { Component } from 'react';
import {connect } from 'react-redux';
import Login from './Login';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import TasksPopUp from './Individual/TasksPopUp';
import Calendar from './Calendar'
import EventDetails from './EventDetails'
import Home from './Home'
import Form from './General/Form'
import Details from './General/Details'
import Properties from "./Individual/Properties";
import PropertyOwner from "./Individual/PropertyOwner";
import PropertyForRenter from "./Individual/PropertyForRenter";
import Rentals from "./Individual/Rentals";
import Tasks from "./Individual/Tasks";
import SubProperties from "./Individual/SubProperties";
import Renter from './Individual/Renter';
import Search from './General/Search';
import { mapStateToProps } from './Login'
import PopUpForProperties from './Individual/PopUpForProperties';
import userObject from '../Models-Object/UserObject';


export class Router extends Component{
    state={routers:null}
    

    //user
componentDidMount=()=>{
//this.props.setUser(new user)
 if (this.props.user.UserID===null) {
    this.setState({routers:<div><Login/>
        <Switch>
        <Route path="/Login" component={Login}></Route>


    </Switch></div>})
    //home
    if (this.props.user.RoleID===2||this.props.user.RoleID===1) {
        this.setState({routers:<div><Home/><Switch>
            <Route path="/Home" component={Home}></Route>
            <Route path="/Calendar" component={Calendar} />
        <Route path='/EventDetails/:id' exact strict component={EventDetails} />
        <Route path="/login" component={Login} />
        <Route path='/Properties' component={Properties} />
        <Route path='/PropertyOwner' component={PropertyOwner} />
        <Route path='/Rentals' component={Rentals} />
        <Route path='/Tasks' component={Tasks} />
        <Route path='/SubProperties' component={SubProperties} />
        <Route path='/Form' component={Form} />
        <Route path='/Renter' component={Renter} />
        <Route path='/Details' component={Details}></Route>
        <Route path='/TasksPopUp' component={TasksPopUp}></Route>
        <Route path='/Search' component={Search}></Route>
        <Route path='/PopUpForProperties'component={PopUpForProperties}></Route>
        </Switch></div>})
    }
    //user3-שוכר
    else
        if (this.props.user.RoleID===3) {
            this.setState({routers:<div><PropertyForRenter/><Switch>

        <Route path='/Details' component={Details}></Route>
        <Route path='/Form' component={Form} />

                <Route path="/PropertyForRenter" component={PropertyForRenter}></Route>
                <Route path="/Task" component={Tasks}></Route>
            </Switch></div>})
        }}}
        render() {
            return(
            <div>
             {this.state.routers}
        </div>
    );
    
}}


export default withRouter(connect(mapStateToProps)(Router));
