import React, { Component, PureComponent } from 'react';
import Login from '../Login/Login'
import Calendar from '../Individual/Calander/Calendar'
import EventDetails from '../EventDetails'
import Sign_up from '../Sign_up'
import Form from '../General/Form/Form'
import Details from '../General/Details/Details'
import Property from "../Individual/Properties/Property";
import Owner from "../Individual/PropertyOwner/Owner";
import PropertyForRenter from "../Individual/PropertiesForRenter/PropertyForRenter";
import Rental from "../Individual/Rentals/Rental";
import Task from "../Individual/Task/Task";
import SubProperties from "../Individual/SubProperties/SubProperties";
import NRenter from '../Individual/Renter/NRenter';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import UserObject from '../../Models-Object/UserObject'
import TasksPopUp from "../TasksPopUp/TasksPopUp";
import RedirectTo from "../RedirectTo";

import './Home.css';
import Logo from './../../logo-nav-bar.jpg';
import Logo1 from './../../logo-nav-bar1.jpg';

import Pic7 from './../../../src/pic7.jpg';
import ImgFooter from '../../../src/footer.jpg'
import Pic6 from './../../../src/building.jpg';

import AwesomeSlider from 'react-awesome-slider';

import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';


const AutoplaySlider = withAutoplay(AwesomeSlider);


export class Home extends PureComponent {
  state = {
    home: false,
    login: null
  }
  componentDidMount = () => {
    this.props.history.replace('/')
  }
  closeModel = () => {
    this.setState({ showt: false })

  }
  closeLogin = () => {
    this.setState({ login: null })
  }
  setHome = (bool) => {
    this.setState({ home: bool })
  }
  rend = () => {

    if (this.props.user.RoleID === 1 || this.props.user.RoleID === 2) {
      if (this.state.home === false)
        return <TasksPopUp setHome={this.setHome} />

    }
    else if (this.props.user.RoleID === 3) {
      if (this.state.home === false)
        this.setState({ home: true })
      return <Redirect to='/PropertiesForRenter' />
    }
  }
  render() {

    // var cron = require('node-cron');
    // const i = () => {
    //   cron.schedule('* */30 * * * * ', () => {
    //     this.setState({ showt: true })

    //   });

    // }
    return (

      <div>
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <div className="NavBar">

          <div className="NavBar-links" >
            <Link hidden={this.props.user.UserID === null} onClick={() => {
              this.props.history.replace('/')
              this.props.setUser(new UserObject()); this.setHome(false)
            }}>{this.props.user.UserName} התנתק </Link>
            <p> </p>
            <p></p>
            <Link onClick={() => this.setState({ login: <Login closeModal={this.closeLogin} setHome={this.setHome} /> })} hidden={this.props.user.UserID !== null}
            > <button >כניסה</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to={{ pathname: '/PropertyOwner' }} onClick={() => { this.setHome(true) }}><button >משכירים</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to={{ pathname: '/Renter' }} onClick={() => { this.setHome(true) }}> <button >שוכרים</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to={{ pathname: '/Properties' }} onClick={() => { this.setHome(true) }}> <button>נכסים</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to="/Calendar" onClick={() => { this.setHome(true) }}><button>יומן</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to={{ pathname: '/Rentals' }} onClick={() => { this.setHome(true) }}><button >השכרות</button></Link>
            <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              to="/Tasks" onClick={() => { this.setHome(true) }}> <button >משימות</button ></Link>
            <Link to="" hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
              onClick={() => { this.setHome(false) }}><button >דף הבית</button></Link>

          </div>
          <div className="task-container">{this.rend()}</div>
          <div >

            <div>
              <img className='nav-bar-logo' src={Logo}></img>
            </div>
          </div>
        </div>
        <div className="body-home-container" hidden={this.state.home}>
          <AutoplaySlider
            play={true}
            cancelOnInteraction={false} // should stop playing on user interaction
            interval={4000}>
            <div data-src={Pic6} />
            <div data-src={Pic7} />
            <div data-src={Logo1} />
          </AutoplaySlider>
          <div hidden={this.props.user.RoleID === 1 || this.props.user.RoleID === 2}>
            {/* className="text-container" */}
            <p className="title">ARGAMAN EXPRESS GROUP</p>
            {/* <p>
    {/* <img className='nav-bar-logo' src={Pic6}></img> */}
          </div>
          <div className="about-text-home">
            <p className="about-text-home-title">מי אנחנו</p>
            <p>חברת ארגמן אקספרס בע"מ הינה חברה פרטית בתחום הנדל"ן אשר נוסדה בשנת 2008.
            במהלך שנות פעילותה צברה החברה ניסיון רב בתחום שיווק נכסים להשקעה , מגורים ומסחרי , ניהול נכסים של משקיעים מהארץ ומחו"ל , שיפוצים ואחזקת מבנים הן להשקעה והן למגורים ,ייעוץ משכנתאות ופתרונות אשראי לפרטיים ועסקים.
            עם השנים צברנו הידע, הכלים וכמובן ניסיון, ובמהלכם רשמנו הישגים מרשימים והפכנו לשם דבר בתחומנו
.עם מחויבות להגשת פתרונות מלאים- אנו זוכים ע״י לקוחותינו למוניטין מוכח כחברה אמינה וערכית. לקוחות אלו בוחרים בנו פעם אחר פעם כשותפים, ואף ממליצים לאחרים</p>

          </div>

          <div className="img-footer-home">
            <img src={ImgFooter}></img>
            <img src={ImgFooter}></img>
            <img src={ImgFooter}></img>
            <img src={ImgFooter}></img>
          </div>
        </div>


        {this.state.login}



        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/signup" component={Sign_up} />
          <Route path="/Calendar" component={Calendar} />
          <Route path='/EventDetails/:id' exact strict component={EventDetails} />
          <Route path="/Login" component={Login} />
          <Route path='/Properties' component={Property} />
          <Route path='/PropertyOwner' component={Owner} />
          <Route name="propertiesForRenter" path='/PropertiesForRenter' component={PropertyForRenter} />
          <Route path='/Rentals' component={Rental} />
          <Route path='/Tasks' component={Task} />
          <Route path='/SubProperties' component={SubProperties} />
          <Route path='/Form' component={Form} />
          <Route path='/Renter' component={NRenter} />
          <Route path='/Route' component={Route} />
          <Route path='/Details' component={Details}></Route>
          <Route path='/RedirectTo' component={RedirectTo} />
        </Switch>
      </div>
      //   </div>

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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))


