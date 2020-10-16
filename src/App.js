import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Calendar from './components/Calendar'
import EventDetails from './components/EventDetails'
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

import Form from './components/General/Form'
import Details from './components/General/Details'
import AddCommonLinks from './components/General/AddCommonLinks'
import Properties from "./components/Individual/Properties";
import PropertyOwner from "./components/Individual/PropertyOwner";
import PropertyForRenter from "./components/Individual/PropertyForRenter";
import Rentals from "./components/Individual/Rentals";
import Tasks from "./components/Individual/Tasks";
import SubProperties from "./components/Individual/SubProperties";
import ReportForm from "./components/Individual/ReportForm";
import Renter from './components/Individual/Renter';
import NotFound from './components/General/NotFound';

function App() {


  return (


    <div className="App">


      <Switch>

        <Route path="/Calendar" component={Calendar} />
        <Route path='/EventDetails/:id' exact strict component={EventDetails} />
        <Route path="/login" component={Login} />
        <Route exact path='/' component={() => <AddCommonLinks name='Leah' age={20}></AddCommonLinks>} />
        <Route path='/Properties' component={Properties} />
        <Route path='/PropertyOwner' component={PropertyOwner} />
        <Route name="propertyForRenter" path='/PropertyForRenter' component={PropertyForRenter} />
        <Route path='/Rentals' component={Rentals} />
        <Route path='/Tasks' component={Tasks} />
        <Route path='/SubProperties' component={SubProperties} />
        <Route path='/Form' component={Form} />
        <Route path='/Renter' component={Renter} />

        {/*:type/:name/:submit/:fieldsArray/:Object/:fieldsToAdd/:LinksForEveryRow
        /:ButtonsForEveryRow/:LinksPerObject/:erors' */}



        <Route path='/Details' component={Details}></Route>
        <Route component={NotFound} />
      </Switch>

    </div>

  );
}

export default withRouter(App);
