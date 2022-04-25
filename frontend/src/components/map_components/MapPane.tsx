import React from "react";
import {Feature} from "ol";
import {Geometry, Point} from "ol/geom";
import {RMap, ROSM} from "rlayers";
import WaypointLayer from "./WaypointLayer";
import RouteLayer from "./RouteLayer";
import ZoneLayer from "./ZoneLayer";
import {RView} from "rlayers/RMap";
import {fromLonLat} from "ol/proj";
import ControlMode from "../controls/ControlMode";
import InterdictionZoneLayer from "./InterdictionZoneLayer";
import ControlFunction from "../../ControlFunction";
import axios from "axios";
import Waypoint from "../../datatypes/Waypoint";
import AppContext from "../../AppContext";

interface MapPaneProps {

}

interface MapPaneState {}

export default class MapPane extends React.Component<MapPaneProps, MapPaneState> {
    static contextType = AppContext

    addWaypoint(e: any) {
        if (this.context.controlMode.mode != "edit-wp") {
            return
        }
        const coords = (e as any).map.getCoordinateFromPixel(e.pixel)
        let temp_point = new Point(coords).transform("EPSG:3857","EPSG:4326") as Point
        axios.get(`/api/routing/util/nearestPoint?lng=${temp_point.getCoordinates()[0]}&lat=${temp_point.getCoordinates()[1]}`).then((response => {
            console.log(response)
            let wp = new Waypoint(response.data.geom['coordinates'], "4326", response.data['id'])
            this.context.addWaypoint(wp)
        }))
    }

    render() {
        let initialView: RView = {
            center: fromLonLat([15.297, -4.371]),
            zoom: 12
        }

        return (
            <RMap
                className='example-map'
                initial={initialView}
                onClick={this.addWaypoint.bind(this)}
            >
                <ROSM/>

                <WaypointLayer
                    zIndex={30}
                />

                <RouteLayer
                    zIndex={20}
                />

                <InterdictionZoneLayer
                    zIndex={15}
                />

                <ZoneLayer
                    zIndex={10}
                />
            </RMap>
        )
    }
}