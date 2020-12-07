import React, { Component, PureComponent } from 'react'
import PropTypes, { object } from 'prop-types';
import { mapStateToProps, mapDispatchToProps } from '../../Login/Login'
import { connect } from 'react-redux'
import './Item.css';
import * as Action from '../Action'



//קומפוננטה להצגת שורה בטבלה
export class Item extends PureComponent {
    gen = this.props.set(this.props.Object);
    state = {
        LinksForDetails: this.gen.LinksForDetails,
        ButtonsForEveryRow: this.gen.ButtonsForEveryRow,
        fieldsToAdd: this.gen.fieldsToAdd,
        LinksPerObject: this.gen.LinksPerObject,
        Object: this.gen.object,
        details: null,
        form: null

    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.set !== this.props.set || prevProps.Object !== this.props.Object) {
            const gen = this.props.set(this.props.Object);
            this.setState({
                LinksForDetails: gen.LinksForDetails,
                ButtonsForEveryRow: gen.ButtonsForEveryRow,
                fieldsToAdd: gen.fieldsToAdd,
                LinksPerObject: gen.LinksPerObject,
                Object: gen.object,
            })
        }
    }
    closeFormModal = () => {
        this.setState({ form: null })
    }
    closeDetailsModal = () => {
        this.setState({ details: null })
    }
    render() {
        debugger
        return (
            <React.Fragment>
                <tr>{this.props.fieldsArray.map((item, index) => { if (index < 6) return <td key={index}>{this.state.Object[item.field]}</td> })}
                    {(this.props.actions && !this.props.restore) ?
                        <div className="icon-container">
                            <td><button onClick={() => {
                                this.setState({ details: this.props.actions(Action.details, null, null, this.props.Object, this.closeDetailsModal) })
                            }} >
                                &#10011;
                             </button>
                            </td>

                            <td><button onClick={() => {
                                this.setState({ form: this.props.actions(Action.form, Action.Update, 'ערוך', this.props.Object, this.closeFormModal) })
                            }} >
                                &#128394;
                            </button>
                            </td>

                            <td><button onClick={() => { this.props.delObject(this.props.Object) }}>
                                &#128465;
                            </button></td>
                        </div>
                        : this.props.restore ?
                            <td><button onClick={() => { this.props.restore(this.props.Object) }}>
                                שחזר
                    </button></td> : null}
                    {this.state.ButtonsForEveryRow.map((but, index) => <td index={index}> {but}</td>)}
                    {this.state.details}
                    {this.state.form}

                </tr>


            </React.Fragment>

        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Item)
Item.propTypes = {
    set: PropTypes.func,
    Object: PropTypes.object,
    fieldsArray: PropTypes.arrayOf(PropTypes.object),
    closeModal: PropTypes.func,
    actions: PropTypes.func,
    delObject: PropTypes.func,
}