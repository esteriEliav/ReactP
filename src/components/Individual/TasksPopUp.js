import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import Axios from '../Axios'
import { Link } from 'react-router-dom';
import { CommonFunctions, GetFunction, postFunction, Search } from '../General/CommonFunctions';


export class TasksPopUp extends Component {
    state = {

        timepassed: [],
        urgent: [],
    }

    componentDidMount = async() => {
       
        this.setState({timepassed :await GetFunction('Task/Getthis.state.timepassedTasks')})
        let object = { TaskTypeId: null, ClassificationID: 1, DateForHandling: null, IsHandled: false }
        this.setState({urgent :await postFunction('Task/Search', object)})
        
    }
    render() {
        return (
            (this.state.timepassed && this.state.timepassed.length > 0 || this.state.urgent && this.state.urgent.length > 0)
            && <Popup open={this.props.isOpen} closeOnDocumentClick={true}
                className="modal" contentStyle={{ backgroundColor: "greenyellow" }}>

                <a className="close" onClick={this.props.closeModal}>
                    &times;
              </a>

                {this.state.timepassed && this.state.timepassed.length > 0 && <h3 dir='rtl'> {this.state.timepassed.length} משימות שעבר זמנם <Link to={{ pathname: '/Tasks', objectArray: this.state.timepassed, type: 'table' }}>לפרטים</Link>  </h3>}
                {this.state.urgent && this.state.urgent.length > 0 && <h3 dir='rtl'>{this.state.urgent.length}  משימות דחופות <Link to={{ pathname: '/Tasks', objectArray: this.state.urgent, type: 'table' }}>לפרטים</Link></h3>}
                <button onClick={this.props.closeModal}>לא עכשיו</button>
            </Popup>

        )
    }
}

export default TasksPopUp
