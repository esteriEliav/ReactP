import React, { Component } from 'react';
import {Link} from 'react-router-dom';


export class Home extends Component {
 

  render(){
    return ( 
<div>
<Link to="/Home"> <button>דף הבית</button></Link>
<Link to=""> <button>נכסים</button></Link>
<Link to=""> <button >השכרות</button></Link>
<Link to="/Calendar"><button >יומן</button></Link>
<Link to="/login"> <button>כללי</button></Link>
<Link to=""><button >משימות</button></Link>

</div>
       
    )
  }}




export default Home


