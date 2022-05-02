import React from "react";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import ExecutionControlTable from "./ExecutionControlTable";
import ControlFunction from "../../ControlFunction";
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs'
import {CSSTransition, TransitionGroup} from "react-transition-group";
import AppContext from "../../AppContext";
import EditZoneView from "../context_panes/EditZoneView";
import InterdictionZoneView from "../context_panes/InterdictionZoneView";
import WaypointsView from "../context_panes/WaypointsView";
import RoutesView from "../context_panes/RoutesView";

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
                <Tabs>
                    <TabList>
                        <Tab>Routes</Tab>
                        <Tab>Weight Zones</Tab>
                        <Tab>Interdiction</Tab>
                        <Tab>Waypoints</Tab>
                    </TabList>

                    <TabPanel style={{position: "relative", maxHeight: "100%", overflow: "auto"}}>
                        <RoutesView />
                    </TabPanel>

                    <TabPanel style={{position: "relative", maxHeight: "100%", overflow: "auto"}}>
                        <EditZoneView />
                    </TabPanel>
                    <TabPanel style={{position: "relative", maxHeight: "100%", overflow: "auto"}}>
                        <InterdictionZoneView />
                    </TabPanel>

                    <TabPanel style={{position: "relative", maxHeight: "100%", overflow: "auto"}}>
                        <WaypointsView />
                    </TabPanel>
                </Tabs>
            </React.Fragment>
        )
    }
}