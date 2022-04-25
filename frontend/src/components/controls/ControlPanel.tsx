import React from "react";
import EditControlTable from "./EditControlTable";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import ExecutionControlTable from "./ExecutionControlTable";
import ControlFunction from "../../ControlFunction";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import AppContext from "../../AppContext";

export type ControlDisplayTier = "root" | "edit"

interface ControlPanelProps {
}

interface ControlPanelState {
    displayTier: ControlDisplayTier
}

export default class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
    static contextType = AppContext
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
                            controlPanelModeFn={this.setDisplayTier.bind(this)}
                        />
                    </div>
                </CSSTransition>

                <CSSTransition in={this.state.displayTier === "root"} classNames={"my-node"} unmountOnExit={true} timeout={500}>
                    <div>
                        <ExecutionControlTable
                            controlPanelTierFn={this.setDisplayTier.bind(this)}
                        />
                    </div>
                </CSSTransition>
            </React.Fragment>
        )
    }
}