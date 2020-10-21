// import React from 'react';
// import { connect } from 'react-redux'
// import Login from '../../Components/Login/Login';
// import { Route, Switch, Redirect, Router } from 'react-router-dom';
// import UsersSignUp from '../Users/SignUp/SignUp';
// import Stores from '../MyStores/MyStores';
// import Report from '../Users/Report/Report';
// import UserNewCard from '../Users/NewCard/NewCard';
// import NewCard from '../Enterprise/NewCard/NewCard';
// import Update from '../Enterprise/Update/Update';
// import Cards from '../Users/Cards/Cards';
// // import NewCard from '../Users/NewCard/NewCard';
// import { withRouter } from 'react-router-dom'
// import Agreement from '../Enterprise/Agreement/Agreement';
// import Clearing from '../Clearing/Clearing';
// import EnterpriseSingUp from '../Enterprise/SignUp//SignUp';
// import ContactUs from '../ContactUs/ContactUs';
// import Chat from '../Chat/Chat';
// import Home from "../Home/Home"
// import MySidebar from "../Sidebar/Sidebar"
// import SignUp from '../Enterprise/SignUp/SignUp';
// import Main from '../Enterprise/Main/Main'
// import NewPassword from "../NewPassword/NewPassword"
// import agreement from '../Enterprise/Agreement/Agreement';
// import EnterpCards from '../Enterprise/EnterpCards/EnterpCards';
// import Profile from "../Profile/Profile";
// const Routes = (props) => {
//     console.log(props)
//     //home
//     let routers = (<Switch>
//         <Route path="/users/login" component={Login}></Route>
//         <Route path="/users/signup" component={UsersSignUp}></Route>
//         <Route path="/enterprises/login" component={Login}></Route>
//         <Route path="/enterprises/signup" component={SignUp}></Route>
//         <Route path="/enterprises/newpassword" component={NewPassword}></Route>
//         <Route path="/enterprises/main" component={Main}></Route>
//         <Route path="/users/newpassword" component={NewPassword}></Route>
//         <Route path="/new" component={NewCard}></Route>
//         <Route path="/agreement" component={Agreement}></Route>
//         <Route path="/" component={Home}></Route>
//     </Switch>);
//     //user
//     if (props.user !== null) {
//         routers = (<Switch>
//             <Route path="/users/cards" component={Cards}></Route>
//             <Route path="/users/cards" component={Cards}></Route>
//             <Route path="/users/new" component={UserNewCard} exact />
//             <Route path="/users/report" component={Report} />
//             <Route path="/" component={Home}></Route>
//         </Switch>)
//     }
//     //enterprise
//     else
//         if (props.enterprise !== null) {
//             routers = (<Switch>
//                 <Route path="/enterprises/newCard" component={NewCard}></Route>
//                 <Route path="/enterprises/enterpCards" component={EnterpCards}></Route>
//                 <Route path="/enterprises/clearing" component={Clearing}></Route>
//                 <Route path="/users/cards" component={Cards}></Route>
//                 <Route path="/users/new" component={UserNewCard} exact />
//                 <Route path="/users/report" component={Report} />
//                 <Route path="/" component={Home}></Route>
//             </Switch>)
//         }
//     return (
//         <div>
//             <Chat></Chat>
//             <MySidebar></MySidebar>
//             {props.enterprise !== null ? <Profile Name={props.enterprise.Name}></Profile> : ""}
//             {routers}
//         </div>
//     );
// }
// const mapStateToProps = state => {
//     return {
//         user: state.user.user,
//         enterprise: state.enterprise.enterprise,
//     }
// }
// export default withRouter(connect(mapStateToProps, null)(Routes));