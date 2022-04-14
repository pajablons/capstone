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
import {ContextProvider} from "./AppContext";

interface AppProps {
}

interface AppState {
    requestState: ServerRequestState
    waypoints: Array<Feature<Geometry>>
    controlMode: ControlMode
}

export default class App extends React.Component<AppProps, AppState> {
    private unique_id: number
    private layerSaveFns: Set<() => void>
    private layerDiscardFns: Set<() => void>
    private controlFns: Map<string, () => void>
    constructor(props: AppProps) {
        super(props)
        this.state = {
            waypoints: new Array<Feature<Geometry>>(),
            requestState: {
                status: RequestState.READY,
                start: new Date(),
                requestType: RequestType.NONE,
            },
            controlMode: {
                mode: "none"
            }
        }

        this.controlFns = new Map<string, () => void>()

        this.layerSaveFns = new Set<() => void>()
        this.layerDiscardFns = new Set<() => void>()

        this.unique_id = 0

        this.registerControlFn({identity: "clear-wp"}, this.clearWaypoints.bind(this))
    }

    setControlMode(mode: ControlMode) {
        this.setState({
            controlMode: mode
        })
    }

    addWaypoint(e: any) {
        if (this.state.controlMode.mode != "edit-wp") {
            return
        }
        const coords = (e as any).map.getCoordinateFromPixel(e.pixel)
        let temp_point = new Point(coords).transform("EPSG:3857","EPSG:4326") as Point
        axios.get(`/api/routing/util/nearestPoint?lng=${temp_point.getCoordinates()[0]}&lat=${temp_point.getCoordinates()[1]}`).then((response => {
            console.log(response)
            this.state.waypoints.push(new Feature({id: response.data['id'], geometry: new Point(response.data.geom['coordinates']).transform("EPSG:4326","EPSG:3857")}))
            this.setState({waypoints: [...this.state.waypoints]})
        }))
    }

    registerSaveDiscardFn(saveFn: () => void, discardFn: () => void) {
        this.layerSaveFns.add(saveFn)
        this.layerDiscardFns.add(discardFn)
    }

    discardAllEdits() {
        this.layerDiscardFns.forEach((discardFn: () => void) => {
            discardFn()
        })
    }

    saveAllEdits() {
        this.layerSaveFns.forEach((saveFn: () => void) => {
            saveFn()
        })
    }

    clearWaypoints() {
        this.setState({
            waypoints: new Array<Feature<Geometry>>()
        })
    }

    executeControlFn(id: ControlFunction) {
        if (this.controlFns.has(id.identity)) {
            this.controlFns.get(id.identity)!()
        } else {
            console.log("No registered function for " + id.identity)
        }
    }

    registerControlFn(id: ControlFunction, fn: () => void) {
        this.controlFns.set(id.identity, fn)
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
                                <MapPane
                                    waypoints={this.state.waypoints}
                                    controlMode={this.state.controlMode}
                                    addWaypointFn={this.addWaypoint.bind(this)}
                                    modFnRegistry={this.registerSaveDiscardFn.bind(this)}
                                    executorRegistryFn={this.registerControlFn.bind(this)}
                                />
                            </div>
                            <div className={"control-sidebar"}>
                                <div className={"edit-container"}>
                                    <ControlPanel
                                        controlModeFn={this.setControlMode.bind(this)}
                                        saveAllFn={this.saveAllEdits.bind(this)}
                                        discardAllFn={this.discardAllEdits.bind(this)}
                                        commandExecutor={this.executeControlFn.bind(this)}
                                    />
                                </div>
                                <div className={"status-container"}>
                                    <StatusDisplay status={this.state.requestState} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContextProvider>
        )
    }
}
