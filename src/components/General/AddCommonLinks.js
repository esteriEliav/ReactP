import Axios from 'axios';
import React, { Component } from 'react'
import Table from '../General/Table'
import Main1 from "../Individual/PropertyOwner";
import PropertyForRenter from "../Individual/PropertyForRenter";
import Properties from "../Individual/Properties";
import Rentals from "../Individual/Rentals";
import Tasks from "../Individual/Tasks";
import SubProperties from "../Individual/SubProperties";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TasksPopUp from "../Individual/TasksPopUp";
import { Link } from 'react-router-dom';
import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';


export class AddCommonLinks extends Component {



    render() {


        /*GetState = (myState) => {
            return myState;
        }*/


        var cron = require('node-cron');
        const i = () => {
            cron.schedule(' */30 * * * *', () => {
                console.log('running every minute 1, 2, 4 and 5');

            });
        }


        return (

            <div>
                {i()}
                <button onClick={() => {
                    Axios.post('PropertyOwner/GetPropertiesbyOwnerID', 2, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
                        .then(res => console.log('res', res.data))
                }}>aaa</button>
                <Link to={{ pathname: '/PropertyOwner' }}>PropertyOwner</Link>

                <hr />
                <Link to={{ pathname: '/Renter' }}>Renters</Link>
                <hr />
                <Link to={{ pathname: '/propertyForRenter' }} >PropertyForRenter</Link>

                <hr />
                <Link to={{ pathname: '/Properties' }}>Properties</Link>
                <hr />
                <Link to={{ pathname: '/Rentals' }}>Rentals</Link>
                <hr />
                <Link to={{ pathname: '/Tasks' }}>Tasks</Link>
                <hr />
                <Link to={{ pathname: '/SubProperties' }}>SubProperties</Link>
                <hr />

            </div>
        )
    }
}

export default AddCommonLinks
