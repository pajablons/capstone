import React from "react";
import Waypoint from "../../datatypes/Waypoint";
import AppContext from "../../AppContext";
import {Point} from "ol/geom";

interface WaypointsViewProps {}

interface WaypointsViewState {}

export default class WaypointsView extends React.Component<WaypointsViewProps, WaypointsViewState> {
    static contextType = AppContext
    langData = require('../../localize/lang.json')

    constructor(props: WaypointsViewProps) {
        super(props);
    }

    enterEditMode(evt: any) {
        this.context.setControlMode({
            mode: "edit-wp"
        })
    }

    render() {
        let data = new Array<JSX.Element>()
        this.context.waypoints.forEach((value: Waypoint) => {
            let wgs84 = value.geometry.clone().transform('EPSG:3857', 'EPSG:4326') as Point
            data.push(
                <tr key={value.id} className={'data-table-row'}>
                    <td>{value.id}</td>
                    <td> </td>
                    <td>{Math.round(wgs84.getCoordinates()[0] * 100000) / 100000}</td>
                    <td>{Math.round(wgs84.getCoordinates()[1] * 100000) / 100000}</td>
                    <td>{value.edges.length}</td>
                </tr>
            )
        })

        return (
            <div style={{overflow: "auto", height: "100%", maxHeight: "100%", width: "100%"}}>
                <button value={"edit-wp"} onClick={this.enterEditMode.bind(this)}>{this.langData['controls']['edit-wp'][this.context.locale.lang]}</button>

                <table className={"editTable"}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                        <th>Edge Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data}
                    </tbody>
                </table>
            </div>
        )
    }
}