import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps } from './Login/Login'
import { connect } from 'react-redux'
import interactionPlugin from '@fullcalendar/interaction';
import Axios from './Axios';
import Tasks from './Individual/Task/Tasks';
import { CommonFunctions, GetFunction, postFunction, Search } from './General/CommonFunctions';
import './Calendar.css'



class Calendar extends React.Component {
  state = {
    events: [
     {/*  { id: 1, title: 'event 1', date: '2020-10-01' },
    { id: 2, title: 'event 2', date: '2020-10-29' }*/}
    ],
  showAddTask: null
  }
  async componentDidMount(){

    // Axios.get('Task/GetAllTasks')
    
    //   .then(response => {
        const events = this.props.tasksList;
        const y = await GetFunction('Task/GetAllTaskTypes');
        const x=new Date()
       
        //const property = propertiesList.find((item => item.typeTaskID === this.state.event.typeTaskID)) 
        const updatedevents = events.map(event => {
        //tempobject.TaskTypeId = typeObj.name
        let x= y.find(obj => obj.TaskTypeId === event.TaskTypeId)
          return {
            id:event.TaskID,
            // id:property.taskTypeName,
            title:x.TaskTypeName,
            date:event.DateForHandling
            // date:new Date(event.DateForHandling.getFullYear(),
            // event.DateForHandling.getMonth(),event.DateForHandling.getDate(),0,0,0,0)
          }
        });

        this.setState({ events: updatedevents });
        //Get call to the events Api
      
  }
  closeModal = () => {
    this.setState({ showAddTask: null });
  }
  routeChange = (arg) => {
   // let path = '/EventDetails/' + arg.event;
   //console.log("details",arg.event)
   const taskObj= this.props.tasksList.find(i=>i.TaskID===parseInt(arg.event.id))
   this.setState({ showAddTask: <Tasks type='details' object={taskObj}
  closeModal={this.closeModal} />})
   //this.props.history.push(path);
  }

  handleDateClick = (arg) => {
    
    //alert('working');
    this.setState({
      showAddTask: <Tasks type='form' formType='Add' formName='הוסף' object={{ DateForHandling: arg.date }}
      closeModal={this.closeModal} />
    })
    
    // let path = '/AddTask'+arg.event.date;
    //this.props.history.push(path);
  };

  render() {
    return (<div className="calendar-container">
      {(this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) && <Redirect to='/n' />}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={this.handleDateClick}
        initialView="dayGridMonth"
        displayEventTime={false}
        weekends={true}
        events={this.state.events}
        eventClick={this.routeChange}
      /> {this.state.showAddTask}
    </div>


    )
  }
}
export default connect(mapStateToProps)(withRouter(Calendar));