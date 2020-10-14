import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { withRouter } from 'react-router-dom';
import hebLocale from '@fullcalendar/core/locales/he';
import axios from 'axios';

class Calendar extends React.Component {
    state={
        events:[]
    }
    componentDidMount(){
      axios.get('https://jsonplaceholder.typicode.com/users')
      .then( response =>{
      const events = response.data.slice(0,4);
      const updatedevents = events.map(event => {
        return {
          id: event.id,
          title: event.name,
          date: '2020-10-14'
        }
      });
      
     this.setState({events: updatedevents});
      //Get call to the events Api
      
    })
    }
  
    routeChange= (arg) =>  {//מעבירה את המשתמש לדף פרטי אירוע על פי האירוע שלחץ עליו
      let path = '/EventDetails/'+ arg.event.id;
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