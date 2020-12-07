import React, { Component, PureComponent } from 'react'
import Popup from 'reactjs-popup';
import LabelInput from '../../General/LabelInput/LabelInput';
import './PopUpForProperties.css'


export class PopUpForProperties extends PureComponent {
    state = {
        object: {}
    }
    change = (e, field) => {
        let obj = { ...this.state.obj };
        if (!e.target && e[0])
            obj[field] = e[0].id;
        else
            obj[field] = e.target.value
        this.setState({ object: obj })
    }
    render() {
        debugger
        return (
            <Popup open={true} closeOnDocumentClick={false}
                contentStyle={{ backgroundColor: "white" }} >
                <a className="close" onClick={this.props.closeModal}>
                    &times;</a>

                <form className="add-type-edit" onSubmit={() => { this.props.submit(this.props.type, this.state.object) }}>
                    {this.props.fieldsArray.map((item, index) => <LabelInput key={index} field={item} contant='' change={this.change} />)}
                    <p />
                    <button type='submit'>הוסף</button>
                </form>
            </Popup>
        )
    }
}

export default PopUpForProperties
