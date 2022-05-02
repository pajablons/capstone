import React from "react";
import Locale from "../../localize/Locale";
import {ControlDisplayTier} from "./ControlPanel";
import ControlFunction from "../../ControlFunction";
import AppContext from "../../AppContext";
import API_Engine from "../../api/API_Engine";
import {Geometry} from "ol/geom";
import {Feature} from "ol";

interface ExecutionControlTableProps {
    controlPanelTierFn: (tier: ControlDisplayTier) => void
}

interface ExecutionControlTableState {}

export default class ExecutionControlTable extends React.Component<ExecutionControlTableProps, ExecutionControlTableState> {
    langData: any
    static contextType = AppContext
    constructor(props: ExecutionControlTableProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    changeControlDisplay(evt: any) {
        let controlTier: ControlDisplayTier
        switch(evt.target.value) {
            case "edit":    controlTier = "edit";   break;
            default:        return;
        }
        this.props.controlPanelTierFn(controlTier)
    }

    findInterdictionZones(evt: any) {
        API_Engine.loadIZL(this.context.searchArea, this.context.edges).then((value: Array<Feature<Geometry>>) => {
            this.context.setControlMode("none")
            this.context.setInterdictionZones(value)
            if (value.length > 0) {
                this.context.setSelectedIZTier(0)
            }
        })
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <button onClick={this.changeControlDisplay.bind(this)} value={"edit"}>
                                {this.langData['controls']['start-edit'][this.context.locale.lang]}
                            </button>
                        </td>
                        <td>
                            <button onClick={this.findInterdictionZones.bind(this)}>{this.langData['controls']['interdict'][this.context.locale.lang]}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}