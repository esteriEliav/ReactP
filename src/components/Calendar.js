import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps } from './Login'
import { connect } from 'react-redux'
import interactionPlugin from '@fullcalendar/interaction';
import Axios from './Axios';




class Calendar extends React.Component {
  state = {
    events: [
      // { id: 1, title: 'event 1', date: '2020-10-01' },
      // { id: 2, title: 'event 2', date: '2020-10-28' }
    ]
  }
  componentDidMount() {
    
    Axios.get('Task/GetAllTasks')
    .then( response =>{
    const events = response.data;
   //const property = propertiesList.find((item => item.typeTaskID === this.state.event.typeTaskID)) 

    const updatedevents = events.map(event => {
      return {
        id: event.typeTaskID, 
      // id:property.taskTypeName,
        title:event.name,
        date:event.date
      }
    });
    
   this.setState({events:updatedevents});
    //Get call to the events Api
  })
  }

  routeChange = (arg) => {
    let path = '/EventDetails/' + arg.event.id;
    this.props.history.push(path);
  }
  
  handleDateClick = (arg) => {
    alert('working');
    let path = '/AddTask'+arg.event.date;
    this.props.history.push(path);
  };

  render() {
    return (this.props.user.RoleID === 1 || this.props.user.RoleID === 2 ? <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]} 
      dateClick={this.handleDateClick}
      initialView="dayGridMonth"
      weekends={true}
      events={this.state.events}
      eventClick={this.routeChange}
    /> : <Redirect to='/n' />



    )
  }
}
export default connect(mapStateToProps)(withRouter(Calendar));