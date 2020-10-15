
export default class owner {


    OwnerID = null;
    OwnerFirstName = null;
    OwnerLastName = null;
    Phone = null;
    Email = null;
    document = null;
    constructor(OwnerID, OwnerFirstName, OwnerLastName, Phone, Email, document = null) {
        this.OwnerID = OwnerID;
        this.OwnerFirstName = OwnerFirstName;
        this.OwnerLastName = OwnerLastName
        this.Phone = Phone
        this.Email = Email
        this.document = document;
    }

}
