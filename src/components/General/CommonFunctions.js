import React from 'react'
import '../Individual/PropertyOwner/PropertyOwner.css'
import { CommonFunctions, GetFunction } from './CommonAxiosFunctions'

export const DocName = (docName) => {
    let name = docName.substring(docName.lastIndexOf('\\') + 1)
    return name.substring(0, name.lastIndexOf('.'));
}
export const DocButtons = (docks) => {

    return docks.map((dock, index) => <button className="button-file" type='button' key={index} onClick={() => { window.open(dock.DocCoding) }}>{DocName(dock.DocName)}</button>)

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