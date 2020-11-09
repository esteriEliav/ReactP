import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import LabelInput from '../General/LabelInput';


export class PopUpForProperties extends Component {
    state = {
        object: {}
    }
    change = (e, field) => {
        let obj = { ...this.state.obj };
        obj[field] = e.target.value
        this.setState({ object: obj })
    }
    render() {
        return (
            <Popup open={true} closeOnDocumentClick={false}
                contentStyle={{ backgroundColor: "red" }} >
                <a className="close" onClick={this.props.closeModal}>
                    &times;</a>

                <form onSubmit={() => { this.props.submit(this.props.type, this.state.object) }}>
                    {this.props.fieldsArray.map((item, index) => <LabelInput key={index} field={item} contant='' change={this.change} />)}
                    <p />
                    <button type='submit'>הוסף</button>
                </form>
            </Popup>
        )
    }
}

export default PopUpForProperties
