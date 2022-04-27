import React, {Component} from 'react'
import Locale from "./localize/Locale";
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import Waypoint from "./datatypes/Waypoint";
import Waypoint_Link from "./datatypes/Waypoint_Link"
import ControlMode from "./components/controls/ControlMode";
import {RequestState} from "./ServerRequestState";
import WeightedZoneStore from "./datatypes/WeightedZoneStore";

const AppContext = React.createContext({})

interface AppContextState {
    locale: Locale
    waypoints: Array<Waypoint>
    routes: Array<Feature<Geometry>>
    wp_connections: Array<Waypoint_Link>
    controlMode: ControlMode
    status: RequestState
    izl: Array<Feature<Geometry>>
    addedZones: Array<WeightedZoneStore>
    deletedZones: Array<WeightedZoneStore>
    zones: Map<number, WeightedZoneStore>
    searchArea: Array<Feature<Geometry>>
    selectedIZ: number | undefined
}

export class ContextProvider extends Component {
    state: AppContextState = {
        locale: {
            lang: "en"
        },
        controlMode: {
            mode: "none"
        },
        routes: new Array<Feature<Geometry>>(),
        waypoints: new Array<Waypoint>(),
        wp_connections: new Array<Waypoint_Link>(),
        status: RequestState.READY,
        izl: new Array<Feature<Geometry>>(),
        addedZones: new Array<WeightedZoneStore>(),
        deletedZones: new Array<WeightedZoneStore>(),
        zones: new Map<number, WeightedZoneStore>(),
        searchArea: Array<Feature<Geometry>>(),
        selectedIZ: undefined,
    }

    setRoutes(routes: Array<Feature<Geometry>>) {
        this.setState({
            routes: routes
        })
    }

    setLocale(locale: Locale) {
        this.setState({locale: locale})
    }

    addWaypoint(wp: Waypoint) {
        this.state.waypoints.push(wp)
        this.setState({
            waypoints: [...this.state.waypoints]
        })
    }

    clearWaypoints() {
        this.setState({
            waypoints: new Array<Waypoint>()
        })
    }

    setIZL(values: Array<Feature<Geometry>>) {
        this.setState({
            izl: values
        })
    }

    setAddedZones(values: Array<WeightedZoneStore>) {
        this.setState({
            addedZones: values
        })
    }

    setControlMode(mode: ControlMode) {
        this.setState({
            controlMode: mode
        })
    }

    setZones(zones: Array<WeightedZoneStore>) {
        this.setState({
            zones: zones
        })
    }

    setDeletedZones(deleted: Array<WeightedZoneStore>) {
        this.setState({
            deletedZones: deleted
        })
    }

    setSearchArea(area: Feature<Geometry>) {
        let newAreas = new Array<Feature<Geometry>>()
        newAreas.push(area)
        this.setState({
            searchArea: newAreas
        })
    }

    selectIZ(iz: number) {
        console.log(`New iz: ${iz}`)
        this.setState({
            selectedIZ: iz
        })
    }

    render() {
        return(
            <AppContext.Provider value={
                {
                    // Localization //
                    locale: this.state.locale,
                    setLocale: this.setLocale.bind(this),

                    // Waypoints //
                    waypoints: this.state.waypoints,
                    addWaypoint: this.addWaypoint.bind(this),
                    clearWaypoints: this.clearWaypoints.bind(this),

                    // Control mode //
                    setControlMode: this.setControlMode.bind(this),
                    controlMode: this.state.controlMode,

                    // Routes //
                    routes: this.state.routes,
                    setRoutes: this.setRoutes.bind(this),

                    // Application Status //
                    status: this.state.status,

                    // Interdiction Zones //
                    izl: this.state.izl,
                    setInterdictionZones: this.setIZL.bind(this),
                    searchArea: this.state.searchArea,
                    setSearchArea: this.setSearchArea.bind(this),
                    selectedIZ: this.state.selectedIZ,
                    selectIZ: this.selectIZ.bind(this),

                    // Weighted Zones //
                    addedZones: this.state.addedZones,
                    setAddedZones: this.setAddedZones.bind(this),
                    deletedZones: this.state.deletedZones,
                    setDeletedZones: this.setDeletedZones.bind(this),
                    zones: this.state.zones,
                    setZones: this.setZones.bind(this)
                }
            }>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export default AppContext