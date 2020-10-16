
export default class owner {


    OwnerID;
    OwnerFirstName;
    OwnerLastName;
    Phone;
    Email;
    Dock;
    docName
    constructor(OwnerID = 0, OwnerFirstName = null, OwnerLastName = null, Phone = null, Email = null, document = null, docName = null) {
        this.OwnerID = OwnerID;
        this.OwnerFirstName = OwnerFirstName;
        this.OwnerLastName = OwnerLastName
        this.Phone = Phone
        this.Email = Email
        this.Dock = document;
        this.docName = docName
    }

}
