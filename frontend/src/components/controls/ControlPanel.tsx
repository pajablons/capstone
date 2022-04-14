import React from "react";
import EditControlTable from "./EditControlTable";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import ExecutionControlTable from "./ExecutionControlTable";
import ControlFunction from "../../ControlFunction";

export type ControlDisplayTier = "root" | "edit"

interface ControlPanelProps {
    controlModeFn: (mode: ControlMode) => void
    saveAllFn: () => void
    discardAllFn: () => void
    commandExecutor: (ident: ControlFunction) => void
}

interface ControlPanelState {
    displayTier: ControlDisplayTier
}

export default class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
    constructor(props: ControlPanelProps) {
        super(props);
        this.state = {
            displayTier: "root"
        }
    }


    setDisplayTier(tier: ControlDisplayTier) {
        this.setState({
            displayTier: tier
        })
    }

    render() {
        switch (this.state.displayTier) {
            case "edit":    return (
                <EditControlTable
                    controlModeFn={this.props.controlModeFn}
                    controlPanelModeFn={this.setDisplayTier.bind(this)}
                    saveAllFn={this.props.saveAllFn}
                    discardAllFn={this.props.discardAllFn}
                    controlExecutor={this.props.commandExecutor}
                />
            )
            case "root":    return (
                <ExecutionControlTable
                    controlPanelTierFn={this.setDisplayTier.bind(this)}
                    controlExecutor={this.props.commandExecutor}
                />
            )
        }
    }
}