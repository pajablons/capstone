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
    waypoints: Array<Waypoint> // Change this to a map!!
    routes: Array<Feature<Geometry>>
    wp_connections: Array<Waypoint_Link>
    controlMode: ControlMode
    status: RequestState
    izl: Array<Feature<Geometry>>
    zones: Map<number, WeightedZoneStore>
    searchArea: Array<Feature<Geometry>>
    selectedIZ: number | undefined
    selectedTier: number | undefined
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
        zones: new Map<number, WeightedZoneStore>(),
        searchArea: Array<Feature<Geometry>>(),
        selectedIZ: undefined,
        selectedTier: undefined,
    }

    setRoutes(routes: Array<Feature<Geometry>>) {
        this.setState({
            routes: routes
        })
    }

    addEdge(edge: Waypoint_Link) {
        let newEdges = this.state.wp_connections
        newEdges.push(edge)
        this.setState({
            wp_connections: [...newEdges]
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

    deleteWaypoint(id: number) {
        const target = this.state.waypoints.filter((value) => {
            return value.id == id
        })[0]

        const newLinks = this.state.wp_connections.filter((link) => {
            return !target.edges.includes(link)
        })

        const ways = this.state.waypoints.filter((value) => {
            return value.id != id
        })
        this.setState({
            waypoints: ways,
            wp_connections: newLinks
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

    setStatus(state: RequestState) {
        this.setState({
            status: state
        })
    }

    setZones(zones: Array<WeightedZoneStore>) {
        this.setState({
            zones: zones
        })
    }

    setSearchArea(area: Feature<Geometry>) {
        let newAreas = new Array<Feature<Geometry>>()
        newAreas.push(area)
        this.setState({
            searchArea: newAreas
        })
    }

    setSelectedTier(tier: number | undefined) {
        this.setState({
            selectedTier: tier
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
                    removeWaypoint: this.deleteWaypoint.bind(this),
                    clearWaypoints: this.clearWaypoints.bind(this),

                    // Control mode //
                    setControlMode: this.setControlMode.bind(this),
                    controlMode: this.state.controlMode,

                    // Routes //
                    routes: this.state.routes,
                    setRoutes: this.setRoutes.bind(this),

                    // Edges //
                    addEdge: this.addEdge.bind(this),
                    edges: this.state.wp_connections,

                    // Application Status //
                    status: this.state.status,
                    setStatus: this.setStatus.bind(this),

                    // Interdiction Zones //
                    izl: this.state.izl,
                    setInterdictionZones: this.setIZL.bind(this),
                    searchArea: this.state.searchArea,
                    setSearchArea: this.setSearchArea.bind(this),
                    selectedIZ: this.state.selectedIZ,
                    selectIZ: this.selectIZ.bind(this),
                    selectedTier: this.state.selectedTier,
                    setSelectedIZTier: this.setSelectedTier.bind(this),

                    // Weighted Zones //
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