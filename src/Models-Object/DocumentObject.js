
export class DocumentObject {
    DocID;
    DocUser;
    DocCoding;
    type;

    constructor(DocID, DocUser, DocCoding, type) {
        this.DocID = DocID;
        this.DocUser = DocUser;
        this.DocCoding = DocCoding;
        this.type = type;

    }
}

export default DocumentObject
