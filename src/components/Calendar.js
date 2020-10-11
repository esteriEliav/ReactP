import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { withRouter } from 'react-router-dom';
import hebLocale from '@fullcalendar/core/locales/he';

class Calendar extends React.Component {
    state={
        events:[
            {id:1, title: 'משימה', date: '2020-09-01'},
            {id:2, title: 'משימה', date: '2020-09-02' }
        ]
    }
    componentDidMount(){
      //Get call to the events Api
    }
  
    routeChange= (arg) =>  {//מעבירה את המשתמש לדף פרטי אירוע על פי האירוע שלחץ עליו
      let path = '/EventDetails/'+arg.event.id;
      this.props.history.push(path);// מעבר לדף פרטי אירוע על ידי ההיסטוריה
    }
  render() {
    return (
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
        weekends={true}
        events={this.state.events}// מערך של אירועים
        eventClick= {this.routeChange}// לחיצה על אירוע
        locale= {hebLocale}
        
      />
    )
  }
}
export default withRouter(Calendar);