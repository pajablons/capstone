import React from "react";
import EditControlTable from "./EditControlTable";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import ExecutionControlTable from "./ExecutionControlTable";
import ControlFunction from "../../ControlFunction";
import {CSSTransition, TransitionGroup} from "react-transition-group";

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
        return (
            <React.Fragment>
                <CSSTransition in={this.state.displayTier === "edit"} classNames={"my-node"} unmountOnExit={true} timeout={500}>
                    <div>
                        <EditControlTable
                            controlModeFn={this.props.controlModeFn}
                            controlPanelModeFn={this.setDisplayTier.bind(this)}
                            saveAllFn={this.props.saveAllFn}
                            discardAllFn={this.props.discardAllFn}
                            controlExecutor={this.props.commandExecutor}
                        />
                    </div>
                </CSSTransition>

                <CSSTransition in={this.state.displayTier === "root"} classNames={"my-node"} unmountOnExit={true} timeout={500}>
                    <div>
                        <ExecutionControlTable
                            controlPanelTierFn={this.setDisplayTier.bind(this)}
                            controlExecutor={this.props.commandExecutor}
                        />
                    </div>
                </CSSTransition>
            </React.Fragment>
        )
    }
}