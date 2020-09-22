import React, { Component } from 'react'

/*TaskID int not null identity,
TaskTypeId int not null,
"Description" nvarchar(max),
PropertyID int,
SubPropertyID int, --constraint DF_Tasks_SubPropertyID default 0,
ClassificationID int,
ClientClassificationID int,
ReportDate datetime,--תאריך פניה
DateForHandling datetime not null,--תאריך לטיפול
IsHandled bit constraint DF_Tasks_IsHandled default 0, --האם טופל
HandlingDate datetime,--תאריך טיפול
HandlingWay nvarchar(max),--אופן טיפול
*/
export class ReportForm extends Component {
    state = {
        malfunctions: {
            // PropertyID=this.props.PropertyID,
            //   SubPropertyID=this.props.SubPropertyID,
            description: "",
            Classification: null,
            ReportDate: new Date(),
            DateForHandling: new Date(new Date().setDate(new Date().getDate() + 25)),
            IsHandled: false,
            HandlingDate: null,
            HandlingWay: ''

        }
    }
    change = (e) => {

        let tempObject = { ...this.state.malfunctions };
        const id = e.target.id;
        tempObject[id] = e.target.value;
        this.setState({ malfunctions: tempObject });

    }
    //onSubmit={() => { this.props.submit }}
    render() {

        return (
            <div>
                <form class="ui form" onSubmit={() => { console.log(this.state.malfunctions) }}>
                    <div class="field">
                        <label>תיאור הבעיה</label>
                        <textarea id="description" placeholder="עד 50 מילים" onChange={(e) => this.change(e)}></textarea>
                    </div>
                    <div class="field">
                        <label>רמת דחיפות</label>
                        <div onChange={(e) => this.change(e)} id="Classification">

                        </div>
                    </div>
                    <input type="Submit" value="שלח" />
                </form>
            </div >
        )
    }
}// {this.props.Classification.map((item) => <div><input  type='radio' name="Classification" value={item.ClassificationID} /><label>{item.ClassificationName}</label></div>)}

export default ReportForm
