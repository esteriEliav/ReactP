import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps } from './Login'
import { connect } from 'react-redux'
import interactionPlugin from '@fullcalendar/interaction';
import Axios from './Axios';
import Tasks from './Individual/Tasks';




class Calendar extends React.Component {
  state = {
    events: [
     {/*  { id: 1, title: 'event 1', date: '2020-10-01' },
    { id: 2, title: 'event 2', date: '2020-10-29' }*/}
    ],
  showAddTask: null
  }
  componentDidMount() {

    Axios.get('Task/GetAllTasks')
      .then(response => {
        const events = response.data;
        //const property = propertiesList.find((item => item.typeTaskID === this.state.event.typeTaskID)) 
        const updatedevents = events.map(event2 => {
          return {
            id:event2.typeTaskID,
            // id:property.taskTypeName,
            title: event2.name,
            date: event2.DateForHandling
          }
        });

        this.setState({ events: updatedevents });
        //Get call to the events Api
      })
  }
  closeModal = () => {
    this.setState({ showAddTask: null });
  }
  routeChange = (arg) => {
    let path = '/EventDetails/' + arg.event.id;
    this.props.history.push(path);
  }

  handleDateClick = (arg) => {
    //alert('working');
    this.setState({
      showAddTask: <Tasks type='form' formType='Add' formName='הוסף' object={{ DateForHandling: arg.date }}
        isOpen={this.state.showAddTask === null} closeModal={this.closeModal} />
    })
    
    // let path = '/AddTask'+arg.event.date;
    //this.props.history.push(path);
  };

  render() {
    return (<div>
      {(this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) && <Redirect to='/n' />}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={this.handleDateClick}
        initialView="dayGridMonth"
        weekends={true}
        events={this.state.events}
        eventClick={this.routeChange}
      /> {this.state.showAddTask}
    </div>


    )
  }
}
export default connect(mapStateToProps)(withRouter(Calendar));