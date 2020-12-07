import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import interactionPlugin from '@fullcalendar/interaction';
import * as Action from '../../General/Action'
import Task from '../Task/Task';
import './Calendar.css'



class Calendar extends React.Component {
  state = {
    events: [

    ],
    showAddTask: null
  }
  componentDidMount() {

    const events = this.props.tasksList;
    const y = this.props.taskTypes

    const updatedevents = events.map(event => {
      let x = y.find(obj => obj.id === event.TaskTypeId)
      return {
        id: event.TaskID,
        title: x.name,
        date: event.DateForHandling

      }
    });

    this.setState({ events: updatedevents });

  }
  closeModal = () => {
    this.setState({ showAddTask: null });
  }
  routeChange = (arg) => {
    const taskObj = this.props.tasksList.find(i => i.TaskID === parseInt(arg.event.id))
    this.setState({
      showAddTask: <Task
        type={Action.details}
        object={taskObj}
        closeModal={this.closeModal} />
    })
  }

  handleDateClick = (arg) => {


    this.setState({
      showAddTask: <Task
        type={Action.form}
        formType={Action.Add}
        formName='הוסף'
        object={{ DateForHandling: arg.date }}
        closeModal={this.closeModal} />
    })
  };

  render() {
    return (<div className="calendar-container">
      {(this.props.user.RoleID !== 1 && this.props.user.RoleID !== 2) && <Redirect to='/' />}
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