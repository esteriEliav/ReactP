import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login'
import Calendar from './components/Calendar'
import EventDetails from './components/EventDetails'
import Sign_up from './components/Sign_up'
import Home from './components/Home/Home'
import Form from './components/General/Form'
import Details from './components/General/Details'
import Properties from "./components/Individual/Properties/Properties";
import PropertyOwner from "./components/Individual/PropertyOwner";
import PropertyForRenter from "./components/Individual/PropertiesForRenter/PropertyForRenter";
import Rentals from "./components/Individual/Rentals/Rentals";
import Tasks from "./components/Individual/Task/Tasks";
import SubProperties from "./components/Individual/SubProperties";
import ReportForm from "./components/Individual/ReportForm";
import Renter from './components/Individual/Renter/Renter';
import NotFound from './components/General/NotFound';
import Router from './components/Router';
import { Route, Switch, withRouter } from 'react-router-dom';
import TasksPopUp from './components/TasksPopUp/TasksPopUp';
import Search from './components/General/Search';
import PopUpForProperties from './components/Individual/PopUpForProperties';

function App() {


  return (

    <div className="App">

      <Home />
      <Switch>
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
        <Route path='/PopUpForProperties' component={PopUpForProperties}></Route>
        <Route path="/PropertyForRenter" component={PropertyForRenter}></Route>
      </Switch>
    </div>

  );
}

export default withRouter(App);
