import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Redirect, withRouter } from 'react-router-dom';
import { mapStateToProps } from './Login'
import { connect } from 'react-redux'


class Calendar extends React.Component {
  state = {
    events: [
      { id: 1, title: 'event 1', date: '2020-09-01' },
      { id: 2, title: 'event 2', date: '2020-09-02' }
    ]
  }
  componentDidMount() {
    //Get call to the events Api
  }

  routeChange = (arg) => {
    let path = '/EventDetails/' + arg.event.id;
    this.props.history.push(path);
  }
  render() {
    return (this.props.user.RoleID == 1 || this.props.user.RoleID == 2 ? <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={this.state.events}
      eventClick={this.routeChange}
    /> : <Redirect to='/n' />



    )
  }
}
export default connect(mapStateToProps)(withRouter(Calendar));