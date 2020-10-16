import React, { Component } from 'react';
import {Link} from 'react-router-dom';


export class Home extends Component {
 

  render(){
    return ( 
<div>
<Link to="/PropertyOwner"><button >משכירים</button></Link>
<Link to="/Properties"> <button>נכסים</button></Link>
<Link to="/Renter"> <button >שוכרים</button></Link>
<Link to="/Calendar"><button >יומן</button></Link>
<Link to="/Tasks"> <button>משימות</button></Link>
<Link to="/Rentals"><button>השכרות</button></Link>
<Link to="/PropertyForRenter"><button >דירות כניסה</button></Link>
<Link to="Login"><button >כניסה</button></Link>
<Link to=""><button >דף הבית</button></Link>

</div>
       
    )
  }}
export default Home


