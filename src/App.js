import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Calendar from './components/Calendar'
import EventDetails from './components/EventDetails'
import Sign_up from './components/Sign_up'
import Home from './components/Home'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    
    <div className="App">
    <Home></Home>
     <Switch>
     <Route path="/Home" component={Home} />
     <Route path="/signup" component={Sign_up} /> 
     <Route path="/Calendar" component={Calendar} /> 
     <Route path='/EventDetails/:id' exact strict component={EventDetails} /> 
     <Route path="/login" component={Login} /> 
    </Switch>
    </div>
  );
}

export default App;
