import React, { Component } from 'react';
import Item from './Item';
import Table from './Table';
import ReportForm from '../MalfunctionsManagement/ReportForm'

export class Managment extends Component {
    state = {
        itemsArray: [{ OwnerID: 1, OwnerName: 'aaa', Phone: '000', Email: 'acd' },
        { OwnerID: 2, OwnerName: 'aaa', Phone: '000', Email: 'acd' },
        { OwnerID: 3, OwnerName: 'aaa', Phone: '000', Email: 'acd' }],
        fieldArray: ['OwnerID', 'OwnerName', 'Phone', 'Email'],
        Classification: [{ ClassificationID: 1, ClassificationName: "דחוף מאוד" },
        { ClassificationID: 2, ClassificationName: "דחוף" }]

    }
    deleteItem = (id) => {

        this.state.itemsArray.map(item => {
            if (item[this.state.fieldArray[0]] === id) {
                const str = <Item fieldArray={this.state.fieldArray} itemObject={item} />
                console.log(str);
                const c = window.confirm("האוביקט" + str + "ימחק מיד");
                console.log(item);
                if (c) {
                    let itemsArray = [...this.state.itemsArray.filter(item => item[this.state.fieldArray[0]] !== id)];
                    this.setState({ itemsArray });
                }
            }
            return
        })

    }
    submit = (e, item) => {
        e.preventDefault();
        let flag = false
        let itemsArray = [...this.state.itemsArray.map(object => {
            if (object[this.state.fieldArray[0]] === item[this.state.fieldArray[0]]) {
                flag = true;
                return item;
            }
            else
                return object;

        }
        )];
        if (!flag)
            itemsArray.push(item);
        this.setState(itemsArray);

    }
    render() {
        return (
            <div>
                <Table itemsArray={this.state.itemsArray} fieldArray={this.state.fieldArray} delItem={this.deleteItem} onsubmit={this.submit} />
                <ReportForm Classification={this.state.Classification}></ReportForm>
            </div>)

    }
}

export default Managment
