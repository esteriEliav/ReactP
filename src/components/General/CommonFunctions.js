import React, { Component } from 'react'
import Axios from '../Axios'
import { Link, Redirect } from 'react-router-dom';



//פונקציה שמוסיפה/מוחקת/מעדכנת אוביקט וגם מבצעת חיפוש

// export class CommonFunctions extends Component {
//     state = {
//         response: null
//     }
//     action = () => {
//         Axios.post(this.props.path, this.props.object).then(res => {
//             this.setState({ response: res.data });
//             if (this.props.type == 'Add')
//                 alert('נוסף בהצלחה')
//             else if (this.props.type == 'Delete')
//                 alert('נמחק בהצלחה')
//             else
//                 alert('עודכן בהצלחה')
//         },
//             res => {
//                 if (this.props.type == 'Add')
//                     alert('תקלה... לא נוסף')
//                 else if (this.props.type == 'Delete')
//                     alert('תקלה... לא נמחק')
//                 else
//                     alert('תקלה... לא עודכן')
//                 console.log('תקלה בשליחת הבקשה')
//             })
//     }
//     render() {
//         return (
//             <div>
//                 {this.action()}
//                 {this.state.response != null ? null : <Redirect to={this.props.redirect} />}
//             </div>
//         )
//     }
// }

// const updateObject = (object, path) => {
//     ;
//     Axios.post(path, object)
//         .then(x => {
//             alert('עודכן בהצלחה')
//             return true;
//         }
//             , () => {
//                 alert('תקלה... לא עודכן')
//                 console.log('תקלה בשליחת הבקשה')
//                 return false;
//             });
// }
// const addObject = (object, path, redirect) => {
//     let bool;

//     Axios.post(path, object)
//         .then(x => {
//             alert('נוסף בהצלחה')
//             bool = true
//         }
//             , () => {
//                 alert('תקלה...  לא עודכן')
//                 console.log('תקלה בשליחת הבקשה')
//                 bool = false;
//             });
//     ;
//     return bool
// }
// const deleteObject = (object, path) => {
//     let bool = true
//     Axios.post(path, object)
//         .then(x => {
//             alert('נמחק בהצלחה')
//             bool = true;
//         }
//             , () => {
//                 alert('תקלה...  לא עודכן')
//                 console.log('תקלה בשליחת הבקשה')
//                 bool = false;
//             });
//     return bool

// }

export const CommonFunctions = async (type, object, path) => {
    let x;
    debugger;
    await Axios.post(path, object).then(res => {
        if (type == 'Add')
            alert('נוסף בהצלחה')
        else if (type == 'Delete')
            alert('נמחק בהצלחה')
        else
            alert('עודכן בהצלחה')
                ;
        x = res.data;
    },
        () => {
            if (type == 'Add')
                alert('תקלה... לא נוסף')
            else if (type == 'Delete')
                alert('תקלה... לא נמחק')
            else
                alert('תקלה... לא עודכן')
            console.log('תקלה בשליחת הבקשה')
            x = null;
        })
        ;
    return x
}
// if (type === 'Add')
//     x = addObject(object, path, redirect)
// else if (type === 'Update')
//     x = updateObject(object, path, redirect)
// else if (type === 'Delete')
//     x = deleteObject(object, path)

// return x;

export const Search = async (object, path) => {
    let x;
    await Axios.post(path, { ...object })
        .then(res => {
            console.log(path,res.data)
            x = res.data;
        }
            , () => {
                alert('תקלה... החיפוש לא הצליח')
                x = null
            });
    return x;
}
export const GetFunction = async (path) => {// לפונקציות get 
    let x;
    await Axios.get(path).then(res => {
        console.log(path,res.data)
        x = res.data
    }, res => { console.log(res); x = null })
    return x;
}

export const postFunction = async (path, data) => {//לפונקציות ששולחות ערך אחד
    let x;
    await Axios.post(path, data).then(res => {
        console.log(path,res.data)
        x = res.data;
        ;
    }, () => { x = null })
        ;
    return x;
}


