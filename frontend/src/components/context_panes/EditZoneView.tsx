import React from "react";
import AppContext from "../../AppContext";
import WeightedZone from "../../api/WeightedZone";
import WeightedZoneStore from "../../datatypes/WeightedZoneStore";

interface EditZoneViewProps {

}

interface EditZoneViewState {

}

export default class EditZoneView extends React.Component<EditZoneViewProps, EditZoneViewState> {
    static contextType = AppContext
    langData = require('../../localize/lang.json')

    constructor(props: EditZoneViewProps) {
        super(props)
    }

    setEditMode() {
        this.context.setControlMode({
            mode: "edit-wz"
        })
    }

    render() {
        let zoneRows = new Array<JSX.Element>()
        Array.from(this.context.zones.values()).forEach((zone: any) => {
            zoneRows.push(
                <tr key={zone.id} className={'data-table-row'}>
                    <td>{zone.id}</td>
                    <td><input defaultValue={zone.weight} /></td>
                    <td><input defaultValue={zone.name} /></td>
                </tr>
            )
        })

        return (
            <div style={{overflow: "auto", height: "100%", maxHeight: "100%", width: "100%"}}>
                <button value={"edit-wz"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-wz'][this.context.locale.lang]}</button>

                <table className={"editTable"}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zoneRows}
                    </tbody>
                </table>
            </div>
        )
    }
}