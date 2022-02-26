import React from "react";
import Locale from "../../localize/Locale";
import {ControlDisplayTier} from "./ControlPanel";

interface ExecutionControlTableProps {
    locale: Locale
    genRouteFn: (evt: any) => void
    controlPanelTierFn: (tier: ControlDisplayTier) => void
}

interface ExecutionControlTableState {}

export default class ExecutionControlTable extends React.Component<ExecutionControlTableProps, ExecutionControlTableState> {
    langData: any
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

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <button onClick={this.props.genRouteFn}>{this.langData['controls']['gen-rts'][this.props.locale.lang]}</button>
                        </td>
                        <td>
                            <button onClick={this.changeControlDisplay.bind(this)} value={"edit"}>
                                {this.langData['controls']['start-edit'][this.props.locale.lang]}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}