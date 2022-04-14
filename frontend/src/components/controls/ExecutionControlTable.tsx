import React from "react";
import Locale from "../../localize/Locale";
import {ControlDisplayTier} from "./ControlPanel";
import ControlFunction from "../../ControlFunction";
import AppContext from "../../AppContext";

interface ExecutionControlTableProps {
    controlPanelTierFn: (tier: ControlDisplayTier) => void
    controlExecutor: (ident: ControlFunction) => void
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
        this.props.controlExecutor({
            identity: "interdict"
        })
    }

    genRoutes(evt: any) {
        this.props.controlExecutor({
            identity: "gen-rts"
        })
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <button onClick={this.genRoutes.bind(this)}>{this.langData['controls']['gen-rts'][this.context.locale.lang]}</button>
                        </td>
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