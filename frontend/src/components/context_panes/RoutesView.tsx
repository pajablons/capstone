import React from "react";
import API_Engine from "../../api/API_Engine";
import {Feature} from "ol";
import {Geometry} from "ol/geom";
import AppContext from "../../AppContext";
import Waypoint_Link from "../../datatypes/Waypoint_Link";
import {RequestState} from "../../ServerRequestState";

interface RoutesViewProps {}

interface RoutesViewState {}

export default class RoutesView extends React.Component<RoutesViewProps, RoutesViewState> {
    langData: any
    static contextType = AppContext
    constructor(props: RoutesViewProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    genRoutes(evt: any) {
        API_Engine.generateRoute(this.context.edges).then((routes: Array<Feature<Geometry>>) => {
            this.context.setRoutes(routes)
        })
    }

    enterEdgeCreationMode() {
        this.context.setControlMode({
            mode: "create-edge"
        })
    }

    exitEditMode() {
        this.context.setControlMode({
            mode: "none"
        })
    }

    render() {
        let routeRows = new Array<JSX.Element>()

        this.context.edges.forEach((edge: Waypoint_Link) => {
            routeRows.push(
                <tr key={edge.src.id + "-" + edge.dst.id}>
                    <td>{edge.src.id}</td>
                    <td>{edge.dst.id}</td>
                    <td>{!!edge.cost ? edge.cost : ""}</td>
                </tr>
            )
        })

        return (
            <div style={{overflow: "auto", height: "100%", maxHeight: "100%", width: "100%"}}>
                <button
                    disabled={this.context.status != RequestState.READY}
                    onClick={this.genRoutes.bind(this)}
                >
                    {this.langData['controls']['gen-rts'][this.context.locale.lang]}
                </button>

                {this.context.controlMode.mode != "create-edge" &&
                    <button
                        disabled={this.context.status != RequestState.READY}
                        onClick={this.enterEdgeCreationMode.bind(this)}
                    >
                        Create Edges
                    </button>
                }

                {this.context.controlMode.mode === "create-edge" &&
                    <button
                        onClick={this.exitEditMode.bind(this)}
                    >
                        {this.langData['controls']['end-edit-wz'][this.context.locale.lang]}
                    </button>
                }

                <table className={"editTable"}>
                    <thead>
                    <tr>
                        <th>Source</th>
                        <th>Dest</th>
                        <th>Cost (km)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {routeRows}
                    </tbody>
                </table>
            </div>
        )
    }
}