import React, { Component } from 'react'
import Axios from '../Axios'



//פונקציה שמוסיפה/מוחקת/מעדכנת אוביקט וגם מבצעת חיפוש



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
    }
    ).catch(() => {
        if (type == 'Add')
            alert('תקלה... לא נוסף')
        else if (type == 'Delete')
            alert('תקלה... לא נמחק')
        else
            alert('תקלה... לא עודכן')
        console.log('תקלה בשליחת הבקשה')
        x = null;

    });
    ;
    return x
}


export const SearchFor = async (object, path) => {
    let x;
    await Axios.post(path, { ...object })
        .then(res => {
            console.log(path, res.data)
            x = res.data;
        }
        ).catch(() => {

            alert('תקלה... החיפוש לא הצליח')
            x = null
        });
    return x;
}
export const GetFunction = async (path) => {// לפונקציות get 
    let x;
    await Axios.get(path).then(res => {
        console.log(path, res.data)
        x = res.data
    }).catch(() => {


        x = null
    });
    return x;
}

export const postFunction = async (path, data) => {//לפונקציות ששולחות ערך אחד
    let x;
    await Axios.post(path, data).then(res => {
        console.log(path, res.data)
        x = res.data;
        ;
    }).catch(() => {

        alert('תקלה... החיפוש לא הצליח')
        x = null
    });

    return x;
}


