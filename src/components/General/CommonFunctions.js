import React, { Component } from 'react'
import Axios from '../Axios'
import { Link, Redirect } from 'react-router-dom';



//פונקציה שמוסיפה/מוחקת/מעדכנת אוביקט וגם מבצעת חיפוש

const updateObject = (object, path) => {
    debugger;
    Axios.post(path, object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(x => {
            alert('עודכן בהצלחה')
            return true;
        }
            , () => {
                alert('תקלה... לא עודכן')
                console.log('תקלה בשליחת הבקשה')
                return false;
            });
}
const addObject = (object, path, redirect) => {
    let bool;

    Axios.post(path, object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(x => {
            alert('נוסף בהצלחה')
            bool = true
        }
            , () => {
                alert('תקלה...  לא עודכן')
                console.log('תקלה בשליחת הבקשה')
                bool = false;
            });
    debugger;
    return bool
}
const deleteObject = (object, path) => {
    let bool = true
    Axios.post(path, object, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(x => {
            alert('נמחק בהצלחה')
            bool = true;
        }
            , () => {
                alert('תקלה...  לא עודכן')
                console.log('תקלה בשליחת הבקשה')
                bool = false;
            });
    return bool

}
export const CommonFunctions = (type, object, objects, redirect, path) => {


    let x = true;
    if (type === 'Add')
        x = addObject(object, path, redirect)
    else if (type === 'Update')
        x = updateObject(object, path, redirect)
    else if (type === 'Delete')
        x = deleteObject(object, path)

    return x;
}
export const Search = (object, path) => {
    let res
    Axios.post(path, { ...object }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
        .then(res => {
            console.log('בהצלחה')
            res = res.data;

        }
            , () => {
                alert('תקלה... החיפוש לא הצליח')
            });
    return res
}
export const GetFunction = (path) => {// לפונקציות get 
    let list = []
   console.log("rrrr",Axios.get(path).then(res => {
        list = res.data !== null ? res.data : []
        console.log(res.data)
    }, res => { console.log(res) }))

    return list;
}

export const postFunction = (path, data) => {//לפונקציות ששולחות ערך אחד
    let list = []
    Axios.post(path, data).then(res => {
        list = res.data !== null ? res.data : []
    })
    return list;
}


