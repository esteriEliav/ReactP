import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Calendar from './components/Calendar'
import EventDetails from './components/EventDetails'
import Sign_up from './components/Sign_up'
import Home from './components/Home'
import Form from './components/General/Form'
import Details from './components/General/Details'
import Properties from "./components/Individual/Properties";
import PropertyOwner from "./components/Individual/PropertyOwner";
import PropertyForRenter from "./components/Individual/PropertyForRenter";
import Rentals from "./components/Individual/Rentals";
import Tasks from "./components/Individual/Tasks";
import SubProperties from "./components/Individual/SubProperties";
import ReportForm from "./components/Individual/ReportForm";
import Renter from './components/Individual/Renter';
import NotFound from './components/General/NotFound';
import Router from './components/Router';
import {BrowserRouter, Switch, withRouter} from 'react-router-dom';


function App() {


  return(
    <div className="App">
<Router/>

    </div>

  );
}

export default withRouter(App);
