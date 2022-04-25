import React from 'react';
import './App.css';
import './style.css'
import 'ol/ol.css'
import {Feature} from "ol";
import {Geometry, Point} from "ol/geom";
import axios from "axios";
import './capstone.css'
import MapPane from "./components/map_components/MapPane";
import Banner from "./components/Banner";
import ControlMode from "./components/controls/ControlMode";
import ControlPanel from "./components/controls/ControlPanel";
import ControlFunction from "./ControlFunction";
import ServerRequestState, {RequestState, RequestType} from "./ServerRequestState";
import StatusDisplay from "./components/StatusDisplay";
import AppContext, {ContextProvider} from "./AppContext";
import EditZoneView from "./components/context_panes/EditZoneView";
import Waypoint from "./datatypes/Waypoint";

interface AppProps {
}

interface AppState {
}

export default class App extends React.Component<AppProps, AppState> {
    static contextType = AppContext

    private unique_id: number
    constructor(props: AppProps) {
        super(props)
        this.state = {}

        this.unique_id = 0
    }

    render() {
        return (
            <ContextProvider>
                <div className={"top-layout"}>
                    <div className={"banner-container"}>
                        <Banner />
                    </div>
                    <div className={"content"}>
                        <div className={"content-grid-wrapper"}>
                            <div className={"map-pane-container"}>
                                <MapPane />
                            </div>
                            <div className={"control-sidebar"}>
                                <div className={"edit-container"}>
                                    <ControlPanel />
                                </div>
                                <div className={"status-container"}>
                                    <StatusDisplay />
                                </div>
                                <div className={"view-container"}>
                                    <EditZoneView />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContextProvider>
        )
    }
}
