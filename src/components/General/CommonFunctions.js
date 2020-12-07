import React from 'react'
import '../Individual/PropertyOwner/PropertyOwner.css'
import { CommonFunctions, GetFunction } from './CommonAxiosFunctions'
import fileDownload from 'js-file-download';
import base64 from 'base64topdf'
import Base64Downloader from 'react-base64-downloader';
import { Document } from 'react-pdf';

export const DocName = (docName) => {
    if (docName) {
        let name = docName.substring(docName.lastIndexOf('\\') + 1)
        return name.substring(0, name.lastIndexOf('.'));
    }
    return null
}
export const DocButtons = (docks) => {

    return docks.map((dock, index) => {
        const exten = dock.DocName ? dock.DocName.substring(dock.DocName.lastIndexOf('.')) : ''

        if (exten.includes('png') || exten.includes('jpg'))
            return <Base64Downloader className="button-file" key={index}
                base64={dock.DocCoding} downloadName={DocName(dock.DocName)}>
                {DocName(dock.DocName)}
            </Base64Downloader>


        else if (exten.includes('pdf')) {
            return <button className="button-file" type='button' key={index}
                onClick={() => { debugger; return <Document file={dock.DocCoding} /> }}>{DocName(dock.DocName)}</button>
            // return <button className="button-file" type='button' key={index}
            //     onClick={() => { fileDownload(base64.base64Decode(dock.DocCoding, dock.DocName), dock.DocName) }}>{DocName(dock.DocName)}</button>
        }
        else {
            return <button className="button-file" type='button' key={index}
                onClick={() => { window.open(dock.DocCoding) }}>{DocName(dock.DocName)}</button>
        }
    })
    // return docks.map((dock, index) => {
    //     console.log('dock.DocCoding', dock.DocCoding);
    //     return <button className="button-file" type='button' key={index}
    //         onClick={() => { fileDownload((dock.DocCoding), DocName(dock.DocName) + '.xlsx'); }}>{DocName(dock.DocName)}</button>

    // })


    // return docks.map((dock, index) => 

}
export const DocDeleteButton = (docks, setDocuments) => {
    return docks.map((dock, index) =>
        <button index='end' type='button' key={index} onClick={async () => {
            const b = window.confirm('למחוק מסמך?')
            if (b) {
                await CommonFunctions('Delete', dock, 'User/DeleteUserDocument')
                let list = await GetFunction('User/GetAllDocuments')
                setDocuments(list !== null ? list : [])
            }
        }}> מחיקת מסמך {DocName(dock.DocName)}</button>)
}
export const DocField = { field: 'doc', name: 'מסמכים', type: 'file', index: 'end' }
export const AddDocField = { field: 'document', name: 'הוסף מסמך', type: 'file', index: 'end' }
export const toPropertiesOptions = (propertiesList, cities, streets) => {
    let city;
    let street;
    const propertiesOptions = propertiesList.filter(i => i.status === true).map(item => {
        city = cities.find(i => i.id === item.CityID)
        street = streets.find(i => i.CityId === item.CityID && i.StreetID === item.StreetID)
        return { id: item.PropertyID, name: item.PropertyID + ':' + street.StreetName + ' ' + item.Number + ' ,' + city.name }
    })
    return propertiesOptions
}
// export const toRenters = (rentersList) => {
//     let renters = rentersList.filter(i => i.status === true)
//     renters = renters.map(item => { return { id: item.UserID, name: item.FirstName + ' ' + item.LastName } })
//     return renters
// }