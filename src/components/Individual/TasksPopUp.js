import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import Axios from '../Axios'
import { Link } from 'react-router-dom';



export class TasksPopUp extends Component {
    state = {

        timepassed: [],
        urgent: [],
    }

    componentDidMount = () => {
        // Axios.get('Task/Getthis.state.timepassedTasks').then(res => {
        //     if (res.status === 200)
        //         this.setState({timepassed :res.data})
        // })
        this.setState({ timepassed: [1, 2, 3, 4, 5, 6] })
        let object = { TaskTypeId: null, ClassificationID: 1, DateForHandling: null, IsHandled: false }
        Axios.post('Task/Search', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => {
            if (res.status === 200)
                this.setState({ urgent: res.data })
        })
    }
    render() {
        return (
            (this.state.timepassed.length > 0 || this.state.urgent.length > 0)
            && <Popup open={this.props.isOpen} closeOnDocumentClick={true}
                className="modal" contentStyle={{ backgroundColor: "greenyellow" }}>

                <a className="close" onClick={this.props.closeModal}>
                    &times;
              </a>

                {this.state.timepassed.length > 0 && <h3 dir='rtl'> {this.state.timepassed.length} משימות שעבר זמנם <Link to={{ pathname: '/Tasks', objectArray: this.state.timepassed, type: 'table' }}>לפרטים</Link>  </h3>}
                {this.state.urgent.length > 0 && <h3 dir='rtl'>{this.state.urgent.length}  משימות דחופות <Link to={{ pathname: '/Tasks', objectArray: this.state.urgent, type: 'table' }}>לפרטים</Link></h3>}
                <button onClick={this.props.closeModal}>לא עכשיו</button>
            </Popup>



        )
    }
}

export default TasksPopUp
