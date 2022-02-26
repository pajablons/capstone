import React from "react";
import {Feature} from "ol";
import {Geometry} from "ol/geom";
import {RMap, ROSM} from "rlayers";
import WaypointLayer from "./WaypointLayer";
import RouteLayer from "./RouteLayer";
import ZoneLayer from "./ZoneLayer";
import {RView} from "rlayers/RMap";
import {fromLonLat} from "ol/proj";
import ControlMode from "../controls/ControlMode";
import Locale from "../../localize/Locale";

interface MapPaneProps {
    waypoints: Array<Feature<Geometry>>
    routeData: Array<Feature<Geometry>>
    controlMode: ControlMode
    locale: Locale
    addWaypointFn: (evt: any) => void
    modFnRegistry: (saveFn: () => void, discardFn: () => void) => void
}

interface MapPaneState {

}

export default class MapPane extends React.Component<MapPaneProps, MapPaneState> {
    render() {
        let initialView: RView = {
            center: fromLonLat([15.297, -4.371]),
            zoom: 12
        }

        return (
            <RMap
                className='example-map'
                initial={initialView}
                onClick={this.props.addWaypointFn}
            >
                <ROSM/>

                <WaypointLayer waypoints={this.props.waypoints} zIndex={30} />

                <RouteLayer routes={this.props.routeData} zIndex={20} />

                <ZoneLayer
                    locale={this.props.locale}
                    controlMode={this.props.controlMode}
                    zIndex={10}
                    modFnRegistry={this.props.modFnRegistry}
                />
            </RMap>
        )
    }
}