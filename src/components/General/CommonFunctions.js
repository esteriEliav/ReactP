import React, { Component } from 'react'
import Axios from '../Axios'
import { Link, Redirect } from 'react-router-dom';



//פונקציה שמוסיפה/מוחקת/מעדכנת אוביקט וגם מבצעת חיפוש
const Search = (object, objects, path) => {
    debugger;
    Axios.post(path, { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(res => {
            if (res.status === 200) {
                console.log('בהצלחה')
                return res.data;
            }
            else
                console.log('תקלה... החיפוש לא הצליח')
            return objects;
        }
            , () => {
                console.log('תקלה בשליחת הבקשה')
                return objects;
            });
}
const updateObject = (object, path) => {
    debugger;
    Axios.post(path, object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(x => {
            if (x.status === 200) {
                console.log('הנכס עודכן בהצלחה', x)
                return true;
            }
            else
                console.log('תקלה... הנכס לא עודכן')
            return false;
        }
            , () => {
                console.log('תקלה בשליחת הבקשה')
                return true;
            });
}
const addObject = (object, path) => {
    let bool = true
    object.UserID = 1;
    debugger;
    Axios.post(path, object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(x => {
            if (x.status === 200) {
                console.log('הנכס עודכן בהצלחה', x)
                bool = true;
            }
            else {
                console.log('תקלה... הנכס לא עודכן')
                bool = false;
            }
        }
            , () => {
                console.log('תקלה בשליחת הבקשה')
                bool = true;
            });
    return bool
}
const deleteObject = (object, path) => {
    window.confirm("האוביקט ימחק מיד");
}
export const CommonFunctions = (type, object, objects, redirect, path) => {

    let x = true;
    if (type === 'Add')
        x = addObject(object, path)
    else if (type === 'Update')
        x = updateObject(object, path)
    else if (type === 'Search') {
        objects = Search(object, objects, path)
    }

    if (x) {

        return <Redirect to={{

            pathname: redirect,
            objects: objects
        }} />
    }
    return false;
}

//export default CommonFunctions
