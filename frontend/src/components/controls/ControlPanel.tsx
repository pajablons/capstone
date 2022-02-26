import React from "react";
import EditControlTable from "./EditControlTable";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import ExecutionControlTable from "./ExecutionControlTable";

export type ControlDisplayTier = "root" | "edit"

interface ControlPanelProps {
    locale: Locale
    controlModeFn: (mode: ControlMode) => void
    genRtsFn: (evt: any) => void
    saveAllFn: () => void
    discardAllFn: () => void
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
                    locale={this.props.locale}
                    controlModeFn={this.props.controlModeFn}
                    controlPanelModeFn={this.setDisplayTier.bind(this)}
                    saveAllFn={this.props.saveAllFn}
                    discardAllFn={this.props.discardAllFn}
                />
            )
            case "root":    return (
                <ExecutionControlTable
                    locale={this.props.locale}
                    controlPanelTierFn={this.setDisplayTier.bind(this)}
                    genRouteFn={this.props.genRtsFn}
                />
            )
        }
    }
}