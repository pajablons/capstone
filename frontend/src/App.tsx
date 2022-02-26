import React from 'react';
import './App.css';
import 'ol/ol.css'
import './style.css'
import {GeoJSON} from "ol/format";
import {Feature} from "ol";
import {
    Geometry,
    LineString,
    Point,
    Polygon
} from "ol/geom";
import axios from "axios";
import VectorSource from "ol/source/Vector";
import WeightedZone from "./api/WeightedZone";
import './capstone.css'
import MapPane from "./components/map_components/MapPane";
import Locale from "./localize/Locale";
import Banner from "./components/Banner";
import ControlMode from "./components/controls/ControlMode";
import ControlPanel from "./components/controls/ControlPanel";

interface AppProps {
}

interface AppState {
    locale: Locale

    waypoints: Array<Feature<Geometry>>
    routes: Array<Feature<Geometry>>
    controlMode: ControlMode
}

export default class App extends React.Component<AppProps, AppState> {
    private unique_id: number
    private layerSaveFns: Set<() => void>
    private layerDiscardFns: Set<() => void>
    constructor(props: AppProps) {
        super(props)
        this.state = {
            waypoints: new Array<Feature<Geometry>>(),
            routes: new Array<Feature<Geometry>>(),
            locale: {
                lang: "en"
            },
            controlMode: {
                mode: "none"
            }
        }

        this.layerSaveFns = new Set<() => void>()
        this.layerDiscardFns = new Set<() => void>()

        this.unique_id = 0
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

    createPaths() {
        if (this.state.waypoints.length < 2) {
            return
        }

        //this.state.waypoints.sort()
        let src = this.state.waypoints[0]
        let dst = this.state.waypoints[1]
        const newRoutes = new Array<Feature<Geometry>>()
        axios.get(`/api/routing/getRoute?pid=${1}&src=${src.get('id')}&dst=${dst.get('id')}`).then((response) => {
            response.data.forEach((feature: any) => {
                newRoutes.push(new Feature<Geometry>({id: feature['id'], geometry: new LineString(feature.geom['coordinates']).transform("EPSG:4326", "EPSG:3857")}))
            })
            this.setState({routes: [...newRoutes]})
        })
    }

    updateWeight(e: any) {
        const zone_id = e.target.getAttribute("zone-id")
        console.log(zone_id)
    }

    updateLocale(loc: Locale) {
        this.setState({
            locale: loc
        })
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

    render() {
        return (
            <div className={"top-layout"}>
                <div className={"banner-container"}>
                    <Banner locale={this.state.locale} setLocaleFn={this.updateLocale.bind(this)} />
                </div>
                <div className={"content"}>
                    <div className={"content-grid-wrapper"}>
                        <div className={"map-pane-container"}>
                            <MapPane
                                locale={this.state.locale}
                                waypoints={this.state.waypoints}
                                routeData={this.state.routes}
                                controlMode={this.state.controlMode}
                                addWaypointFn={this.addWaypoint.bind(this)}
                                modFnRegistry={this.registerSaveDiscardFn.bind(this)}
                            />
                        </div>
                        <div className={"control-sidebar"}>
                            <div className={"edit-container"}>
                                <ControlPanel
                                    locale={this.state.locale}
                                    controlModeFn={this.setControlMode.bind(this)}
                                    genRtsFn={this.createPaths.bind(this)}
                                    saveAllFn={this.saveAllEdits.bind(this)}
                                    discardAllFn={this.discardAllEdits.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
