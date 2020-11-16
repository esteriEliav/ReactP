import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import Axios from '../Axios'
import { Link } from 'react-router-dom';
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';
import './TasksPopUp.css';
import { mapStateToProps,mapDispatchToProps } from '../Login/Login'
import { connect } from 'react-redux'

export class TasksPopUp extends Component {
    state = {

        timepassed:[],
        urgent:[],
        NotClassificated:[]
    }

    componentDidMount = () => {
       debugger
       this.setState({timepassed: this.props.tasksList.filter(i=>new Date(i.DateForHandling) <new Date() && i.status==true)}) 
       this.setState({urgent:this.props.tasksList.filter(i=>i.ClassificationID ===1 && i.status==true)})
       this.setState({NotClassificated:this.props.tasksList.filter(i=>i.ClassificationID===null && i.status==true)})
        
        // this.setState({timepassed :await GetFunction('Task/GetTimePassedTasks')})
        // let object = { TaskTypeId: null, ClassificationID: 1, DateForHandling: null, IsHandled: false }
        // this.setState({urgent :await postFunction('Task/Search', object)})
        // this.setState({NotClassificated :await GetFunction('Task/GetNotClassificatedTasks')})
    }
   
    render() {
       debugger
        return (
            <div>
           { (this.state.timepassed && this.state.timepassed.length > 0 || this.state.urgent && this.state.urgent.length > 0 
           || this.state.NotClassificated && this.state.NotClassificated.length > 0) &&
             
            //   && <Popup  open={this.props.isOpen} closeOnDocumentClick={true}
            //     className="modal" contentStyle={{ backgroundColor: "greenyellow" }}>

            //      <a className="close" onClick={this.props.closeModal}>
            //         &times;
            //   </a>
            <div className="all-task">

                {this.state.timepassed && this.state.timepassed.length > 0 && 
                <h3 dir='rtl'> {this.state.timepassed.length} משימות שעבר זמנם <Link onClick={()=>{this.props.setHome(true)}}
                 to={{ pathname: '/Tasks', objects: this.state.timepassed, type: 'table' }}>לפרטים</Link>  </h3>}
             
                {this.state.urgent && this.state.urgent.length > 0 && 
                <h3 dir='rtl'>{this.state.urgent.length}  משימות דחופות <Link onClick={()=>{this.props.setHome(true)}} 
                to={{ pathname: '/Tasks', objects: this.state.urgent, type: 'table' }}>לפרטים</Link></h3>}
              
                 {this.state.NotClassificated && this.state.NotClassificated.length > 0 && 
                <h3 dir='rtl'>{this.state.NotClassificated.length}  משימות לסווג <Link onClick={()=>{this.props.setHome(true)}} 
                to={{ pathname: '/Tasks', objects: this.state.NotClassificated, type: 'table' }}>לפרטים</Link></h3>}
                
                {/* {j()} */}
                {/* <button onClick={this.props.closeModal}>לא עכשיו</button> */}
            {/* </Popup> */}
            </div> }
           
            </div>

        )
    }
}

export default connect (mapStateToProps,mapDispatchToProps)(TasksPopUp)
