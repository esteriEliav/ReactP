import React, { Component } from 'react'
import Table from '../General/Table'


//import Main1 from "../Individual/PropertyOwner";
//import PropertyForRenter from "../Individual/PropertyForRenter";
//import Properties from "../Individual/Properties";
import Rentals from "../Individual/Rentals";
import Tasks from "../Individual/Tasks";
import SubProperties from "../Individual/SubProperties";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';


export class AddCommonLinks extends Component {


    /*  state = {
  
          LinksForEveryRow: [{ name: 'עריכה', link: '/Form' }, ...this.props.LinksForEveryRow],
          LinksForTable: [...this.props.LinksForTable, { name: '  הוספת ' + this.props.name, link: '/Form' }],
          ButtonsForEveryRow: [...this.props.ButtonsForEveryRow, { name: 'מחיקה', onclick: this.props.delObject }],
  
      }
      // componentWillMount = () => {
      //   this.props.setForAddCommonLinks(this.state.LinksForEveryRow, this.state.LinksForTable, this.state.ButtonsForEveryRow)
      //  }
  
  
      componentWillMount = () => {
          let LinksForEveryRow = [{ name: 'עריכה', link: '/Form' }];
          let LinksForTable = [{ name: '  הוספת ' + this.props.name, link: '/Form' }];
          let ButtonsForEveryRow = [{ name: 'מחיקה', onclick: this.props.delObject }];
          this.props.setForAddCommonLinks(LinksForEveryRow, LinksForTable, ButtonsForEveryRow)
      }
      */
    /*componentWillMount = () => {
      let LinksForEveryRow = [{ name: 'עריכה', link: '/Form', index: 'end' }, ...this.props.LinksForEveryRow];
       let LinksForTable = [...this.props.LinksForTable, { name: '  הוספת ' + this.props.name, link: '/Form' }];
       let ButtonsForEveryRow = [...this.props.ButtonsForEveryRow, { name: 'מחיקה', onclick: this.props.delObject, index: 'end' }];

       this.props.setForAddCommonLinks(LinksForEveryRow, LinksForTable, ButtonsForEveryRow)
       
       // console.log('ButtonsForEveryRow', ButtonsForEveryRow)
       //{ console.log('LinksForEveryRow-addcom..', LinksForEveryRow) }
   }*/

    render() {

        /*  let name = [...this.props.name];
          let fieldsArray = [...this.props.fieldsArray];
          let objectsArray = [...this.props.objectsArray];
          let LinksForEveryRow = [...this.props.LinksForEveryRow,
          { name: 'עריכה', link: '/Form' }];
          let LinksForTable = [...this.props.LinksForTable, { name: 'הוספת' + { name }, link: '/Form' }];
          let ButtonsForEveryRow = [...this.props.ButtonsForEveryRow, { name: 'מחיקה', onclick: this.props.delObject }];
          let ButtonsForTable = [...this.props.ButtonsForTable];
          this.props.set(name, fieldsArray, objectsArray, LinksForEveryRow, LinksForTable, ButtonsForEveryRow, ButtonsForTable)
          */
        //this.props.set(this.state.name, this.state.fieldsArray, this.state.objectsArray, this.state.LinksForEveryRow, this.state.LinksForTable) 

        //                <button onClick={() => this.props.set(this.state.name, this.state.fieldsArray, this.state.objectsArray, this.state.LinksForEveryRow, this.state.LinksForTable)}>a</button>

        // const n = { name: 'Leah', age: 20, city: 'Haifa' }
        const a = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
        //const a = [1, 2, 3, 4];
        const y = '2000'
        return (

            <div>
                <h1>{this.props.name}</h1>
                <h1>{this.props.age}</h1>
                <Link to={'/PropertyOwner/:' + 5}>PropertyOwner</Link>
                <hr />
                <Link to={{
                    pathname: '/propertyForRenter',
                    vari: [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }],
                    aaa: 'leah'
                }} >PropertyForRenter</Link>
                <hr />
                <Link to='/Properties'>Properties</Link>
                <hr />
                <Link to='/Rentals'>Rentals</Link>
                <hr />
                <Link to='/Tasks'>Tasks</Link>
                <hr />
                <Link to='/SubProperties'>SubProperties</Link>
                <hr />
            </div>
        )
    }
}

export default AddCommonLinks
