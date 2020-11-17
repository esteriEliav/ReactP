import React, { Component } from 'react';
import Login from '../Login/Login'
import Calendar from '../Calendar'
import EventDetails from '../EventDetails'
import Sign_up from '../Sign_up'
import Form from '../General/Form'
import Details from '../General/Details'
import Properties from "../Individual/Properties/Properties";
import PropertyOwner from "../Individual/PropertyOwner";
import PropertyForRenter from "../Individual/PropertiesForRenter/PropertyForRenter";
import Rentals from "../Individual/Rentals/Rentals";
import Tasks from "../Individual/Task/Tasks";
import SubProperties from "../Individual/SubProperties";
import ReportForm from "../Individual/ReportForm";
import Renter from '../Individual/Renter/Renter';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import UserObject from '../../Models-Object/UserObject'
import TasksPopUp from "../TasksPopUp/TasksPopUp";
import RedirectTo from "../RedirectTo";
import Axios from 'axios';
import { GetFunction, postFunction } from '../General/CommonFunctions';
import Select from "react-dropdown-select";

import './Home.css';
import Logo from './../../logo-nav-bar.jpg';
import Pic7 from './../../../src/pic7.jpg';
import ImgFooter from '../../../src/footer.jpg'
//import Pic2 from './../../pic2.jpg';
import Pic6 from './../../../src/building.jpg';

import Pic1 from './../../pic1.png';
//import Pic6 from './../../pic6.png';
import Pic9 from './../../pic9.png';

import AwesomeSlider from 'react-awesome-slider';

import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';


const AutoplaySlider = withAutoplay(AwesomeSlider);


export class Home extends Component {
  state = {
    showt: false,
    home:false,
    login:null
  }
  
  closeModel = () => {
    this.setState({ showt: false })

  }
  closeLogin=()=>{
    this.setState({login:null})
  }
  // authorization = () => {
  //   if (this.props.user.RoleID === 1 || this.props.user.RoleID === 2) {
  //     return null
  //   }
  //   return <Redirect to='/a' />
  // }
setHome=(bool)=>{
  this.setState({home:bool})
}
rend=()=>{
  
  if(this.props.user.RoleID===1 || this.props.user.RoleID===2)
  {
    //this.state.showt &&
    if(this.state.home===false)
    return  <TasksPopUp setHome={this.setHome} />

  }
  else if(this.props.user.RoleID===3)
  {
    if(this.state.home===false)
     this.setState({home:true})
      return <Redirect to= '/PropertyForRenter' />
    }
}
  render() {
    
    var cron = require('node-cron');
    const i = () => {
      cron.schedule('* */30 * * * * ', () => {
        this.setState({ showt: true })

      });
      
    }

     

    return (

      <div>
   <meta charset="utf-8"></meta>
  <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  <div className="NavBar">
  
    
      {/* <button onClick={() => { this.props.setUser(use2);}}>משתמש מזכירה</button>
     <button > בבבבללבלבלבללהללהלהלהלהלהלהלהלה להלהלהלהלהלהלהלהלהלהלהלהל</button> */}

    <div className="NavBar-links" >
      {/* כל ארבעת השורות הללו לא צריך להתייחס בעיצוב כי זה רק בשביל שתוכלי לראות*/}
     
      <Link hidden={this.props.user.UserID === null} onClick={() => { this.props.setUser(new UserObject());this.setHome(false)}}>{this.props.user.UserName} התנתק </Link>
       <Link onClick={()=>this.setState({login:<Login closeModal={this.closeLogin} setHome={this.setHome}/>})} hidden={this.props.user.UserID !== null}
       > <button >כניסה</button></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to={{ pathname: '/PropertyOwner' }} onClick={() => {this.setHome(true)}}><button >משכירים</button></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to={{ pathname: '/Properties' }} onClick={() => {this.setHome(true)}}> <button>נכסים</button></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to={{ pathname: '/Renter' }} onClick={() => {this.setHome(true)}}> <button >שוכרים</button></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to="/Calendar" onClick={() => {this.setHome(true)}}><button>יומן</button></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to="/Tasks" onClick={() => {this.setHome(true)}}> <button >משימות</button ></Link>
      <Link hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       to={{ pathname: '/Rentals' }} onClick={() => {this.setHome(true)}}><button >השכרות</button></Link>
      <Link to="" hidden={this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2}
       onClick={() => {this.setHome(false)}}><button >דף הבית</button></Link>
      
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
     interval={3000}> 
    <div data-src={Pic6} />
    <div data-src={Pic7} />
    <div data-src={Logo} />
    </AutoplaySlider>
<div className="text-container" hidden={this.props.user.RoleID===1 || this.props.user.RoleID===2}> 
    <p className="title">ARGAMAN EXPRESS</p>
    {/* <p>חברת ארגמן אקספרס בע"מ הינה חברה פרטית בתחום הנדל"ן אשר נוסדה בשנת 2008 
במהלך שנות פעילותה, צברה החברה ניסיון רב בתחום שיווק נכסים להשקעה , מגורים ומסחרי , ניהול נכסים של משקיעים מהארץ ומחו"ל , שיפוצים ואחזקת מבנים הן להשקעה והן למגורים ,ייעוץ משכנתאות ופתרונות אשראי לפרטיים ועסקים.
עם השנים צברנו הידע, הכלים וכמובן ניסיון, ובמהלכם רשמנו הישגים מרשימים והפכנו לשם דבר בתחומנו
עם מחויבות להגשת פתרונות מלאים- אנו זוכים ע״י לקוחותינו למוניטין מוכח כחברה אמינה וערכית. לקוחות אלו בוחרים בנו פעם אחר פעם כשותפים, ואף ממליצים לאחרים.</p>
    {/* <p>הוא ממש מושלם ומעניין שווה לכם לבוא לבקר פה...</p> */}

    {/* <img className='nav-bar-logo' src={Pic6}></img> */}
  </div>
  <div className="about-text-home"> 
  <p className="about-text-home-title">מי אנחנו</p>
  <p>מתמחה בייזום וניהול של פרויקטי נדל"ן. במוקד העשייה שלה שני ערכים מרכזיים – פוטנציאל השבחה גבוה וראיית הלקוח במרכז. השילוב של שני הגורמים מביא ללקוחותינו את אותן עסקאות הנמצאות ב"שפיץ" של ענף הנדל"ן. על מנת להגיע ליעדים אלו החברה, ראשיה ועובדיה מחויבים לערכים נוספים של מצוינות, אמינות, מסוגלות ויצירתיות.</p>
  </div>

  <div className="img-footer-home">
  <img src={ImgFooter}></img>
  <img src={ImgFooter}></img>
  <img src={ImgFooter}></img>
  <img src={ImgFooter}></img>
  </div>
  </div> 
  
    {i()}
     {this.state.login}
     
       

<switch>
    <Route path="/Home" component={Home} />
    <Route path="/signup" component={Sign_up} />
    <Route path="/Calendar" component={Calendar} />
    <Route path='/EventDetails/:id' exact strict component={EventDetails} />
    <Route path="/Login" component={Login} />
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
    <Route path='/RedirectTo' component={RedirectTo} />
  </switch>
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


export default connect(mapStateToProps, mapDispatchToProps)(Home)


