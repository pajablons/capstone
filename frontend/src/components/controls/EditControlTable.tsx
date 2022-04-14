import React from "react";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import {ControlDisplayTier} from "./ControlPanel";
import ControlFunction from "../../ControlFunction";
import AppContext from "../../AppContext";

interface EditControlTableProps {
    controlModeFn: (mode: ControlMode) => void
    controlPanelModeFn: (tier: ControlDisplayTier) => void
    saveAllFn: () => void
    discardAllFn: () => void
    controlExecutor: (ident: ControlFunction) => void
}

interface EditControlTableState {}

export default class EditControlTable extends React.Component<EditControlTableProps, EditControlTableState> {
    langData: any
    static contextType = AppContext
    constructor(props: EditControlTableProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    endEditMode(evt: any) {
        this.props.controlPanelModeFn("root")
        this.props.saveAllFn()
        this.setEditMode(evt)
    }

    setEditMode(evt: any) {
        console.log(evt.target.value)
        this.props.controlModeFn({
            mode: evt.target.value
        })
    }

    exec(evt: any) {
        this.props.controlExecutor({identity: evt.target.value})
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td><button value={"edit-wz"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-wz'][this.context.locale.lang]}</button></td>
                        <td><button value={"edit-wp"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-wp'][this.context.locale.lang]}</button></td>
                        <td><button value={"clear-wp"} onClick={this.exec.bind(this)}>{this.langData['controls']['clear-wp'][this.context.locale.lang]}</button></td>
                        <td><button value={"edit-search-area"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['set-search-area'][this.context.locale.lang]}</button></td>
                        <td><button value={"edit-param"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-param'][this.context.locale.lang]}</button></td>
                        <td><button value={"none"} onClick={this.endEditMode.bind(this)}>{this.langData['controls']['end-edit-session'][this.context.locale.lang]}</button></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}