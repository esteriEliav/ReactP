class user {
    UserID
    FirstName
    LastName
    SMS
    Email
    Phone
    RoleID
    UserName
    Password
    Dock
    DocName
    status

    constructor(userID = null, FirstName = null, LastName = null, SMS = null, Email = null, Phone = null, RoleID = null, userName = null, Password = null, document = null, docName = null, status = true) {
        this.UserID = userID
        this.FirstName = FirstName
        this.LastName = LastName
        this.SMS = SMS
        this.Email = Email
        this.Phone = Phone
        this.RoleID = RoleID
        this.UserName = userName
        this.Password = Password
        this.Dock = document
        this.DocName = docName
        this.status = status
    }

}
export default user