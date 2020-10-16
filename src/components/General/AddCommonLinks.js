import Axios from '../Axios';
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
import { Link, Redirect } from 'react-router-dom';
import { CommonFunctions, GetFunction, postFunction } from './CommonFunctions';
import { connect } from 'react-redux'
import UserObject from '../../Models-Object/UserObject'
import PropertyOwnerObject from '../../Models-Object/PropertyOwnerObject'



export class AddCommonLinks extends Component {

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
        /*GetState = (myState) => {
                return myState;
            }*/
        var cron = require('node-cron');
        const i = () => {
            cron.schedule(' */30 * * * * *', () => {
                console.log('running every minute 1, 2, 4 and 5');
                this.setState({ showt: true })

            });

        }

        const use1 = new UserObject(1, 'aa', 'bb', null, null, null, 3);
        const use2 = new UserObject(1, 'aa', 'bb', null, null, null, 1);
        const owner = new PropertyOwnerObject(1, 'a', 'b', null, 'aaa', null);
        return (

            <div>
                {i()}

                {/* {this.state.showt && <TasksPopUp isOpen={this.state.showt} closeModal={this.closeModel} />} */}
                <button onClick={() => { this.props.setUser(use1); console.log('user', this.props.user); }}>set user-renter</button>
                <button onClick={() => { this.props.setUser(use2); console.log('user', this.props.user); }}>set user-manager</button>
                <button onClick={() => {
                    Axios.post('PropertyOwner/GetPropertiesbyOwnerID', 2, { headers: { 'Access-Control-Allow-Origin': '*' } })
                        // { headers: {  'application/x-www-form-urlencoded;  } }



                        .then(res => console.log('res', res.data))
                }}>try of axios</button>

                <Link to={{ pathname: '/PropertyOwner', authorization: this.authorization }}>PropertyOwner</Link>
                <hr />
                <Link to={{ pathname: '/Renter', authorization: this.authorization }}>Renters</Link>
                <hr />
                <Link to={{ pathname: '/propertyForRenter' }} >PropertyForRenter</Link>

                <hr />
                <Link to={{ pathname: '/Properties', authorization: this.authorization }}>Properties</Link>
                <hr />
                <Link to={{ pathname: '/Rentals', authorization: this.authorization }}>Rentals</Link>
                <hr />
                <Link to={{ pathname: '/Tasks' }}>Tasks</Link>
                <hr />
                <Link to={{ pathname: '/SubProperties', authorization: this.authorization }}>SubProperties</Link>
                <hr />

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


export default connect(mapStateToProps, mapDispatchToProps)(AddCommonLinks)
//export default AddCommonLinks
