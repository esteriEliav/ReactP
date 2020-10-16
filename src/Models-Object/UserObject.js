class user {
    userID
    FirstName
    LastName
    SMS
    Email
    Phone
    RoleID
    userName
    Password
    Dock
    docName
    constructor(userID = null, FirstName = null, LastName = null, SMS = null, Email = null, Phone = null, RoleID = null, userName = null, Password = null, document = null, docName = null) {
        this.userID = userID
        this.FirstName = FirstName
        this.LastName = LastName
        this.SMS = SMS
        this.Email = Email
        this.Phone = Phone
        this.RoleID = RoleID
        this.userName = userName
        this.Password = Password
        this.Dock = document
        this.docName = docName
    }


}
export default user