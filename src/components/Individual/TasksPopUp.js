import React, { Component } from 'react'
//import Popup from 'reactjs-popup';
import Axios from '../Axios'
import { Link } from 'react-router-dom';



export class TasksPopUp extends Component {
    state = {
        isOpen: this.props.isOpen,
        timepassed: [],
        urgent: [],
    }
    closeModal = () => {
        this.setState({ isOpen: false })
    }



    componentDidMount = () => {
        // Axios.get('Task/Getthis.state.timepassedTasks').then(res => {
        //     if (res.status === 200)
        //         this.setState({timepassed :res.data})
        // })
        this.setState({ timepassed: [1, 2, 3, 4] })
        let object = { TaskTypeId: null, ClassificationID: 1, DateForHandling: null, IsHandled: false }
        Axios.post('Task/Search', object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then(res => {
            if (res.status === 200)
                this.setState({ urgent: res.data })
        })
    }
    render() {
        return (


            <div>
                {/* // <Popup open={this.state.isOpen} closeOnDocumentClick={false} className="modal" keepTooltipInside={true} position='bottom left' modal> */}

                <a className="close" onClick={this.closeModal}>
                    &times;
              </a>
                <h3 dir='rtl'> {this.state.timepassed.length} משימות שעבר זמנם <Link to={{ pathname: '/Tasks', objectArray: this.state.timepassed, type: 'table' }}>לפרטים</Link>  </h3>
                <h3 dir='rtl'>{this.state.urgent.length}  משימות דחופות <Link to={{ pathname: '/Tasks', objectArray: this.state.urgent, type: 'table' }}>לפרטים</Link></h3>

                {/* // </Popup> */}
            </div>


        )
    }
}

export default TasksPopUp
