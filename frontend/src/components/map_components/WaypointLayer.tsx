import React from "react";
import {RFeature, RLayerVector, RPopup} from "rlayers";
import {Feature} from "ol";
import {Geometry, LineString, Point} from "ol/geom";
import AppContext from "../../AppContext";
import Waypoint from "../../datatypes/Waypoint";
import Waypoint_Link from "../../datatypes/Waypoint_Link";
import API_Engine from "../../api/API_Engine";
import axios from "axios";

interface WaypointLayerProps {
    zIndex: number
}

interface WaypointLayerState {

}

export default class WaypointLayer extends React.Component<WaypointLayerProps, WaypointLayerState> {
    static contextType = AppContext

    private openNetworkEdge: Waypoint | undefined

    constructor(props: WaypointLayerProps) {
        super(props);

        this.openNetworkEdge = undefined
    }

    componentDidMount() {
        axios.get(`/api/laydown/points/all?profile=1`).then((response) => {
            response.data.forEach((obj: any) => {
                let wp = new Waypoint(obj.geom['coordinates'], "4326", obj['id'])
                this.context.addWaypoint(wp)
            })
        })
    }

    setRouteNode(evt: any) {
        const id = evt.target.get('id')
        let targ = this.context.waypoints.filter((wp: Waypoint) => {
            return wp.id === id
        })[0]
        if (!!this.openNetworkEdge && this.openNetworkEdge.id != id) {
            const newEdge = new Waypoint_Link(this.openNetworkEdge, targ, true)
            this.openNetworkEdge = undefined
            this.context.addEdge(newEdge)

            API_Engine.generateRoute(this.context.edges).then((routes: Array<Feature<Geometry>>) => {
                this.context.setRoutes(routes)
            })
        } else {
            this.openNetworkEdge = targ
        }
    }

    removeWaypoint(evt: any) {
        evt.preventDefault()
        const id = evt.target.get('id')
        axios.get(`/api/laydown/points/remove?point_id=${id}&prof_id=1`).then((response) => {
            this.context.removeWaypoint(id)
        })
    }

    render() {
        return (
            <React.Fragment>
                <RLayerVector zIndex={this.props.zIndex + 1}>
                    {this.context.edges.map((edge: Waypoint_Link) => {
                        return (
                            <RFeature
                                geometry={new LineString([edge.src.geometry.getCoordinates(), edge.dst.geometry.getCoordinates()])}
                            />
                        )
                    })}
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex}>
                    {this.context.waypoints.map((pt: Waypoint) => {
                        return <RFeature
                            key={pt.id}
                            feature={pt.feature}
                            onSingleClick={this.setRouteNode.bind(this)}
                            onDblClick={this.removeWaypoint.bind(this)}
                        >
                            {/*<RPopup trigger={"click"} className={"card"}>*/}
                            {/*    <div className={"container"}>*/}
                            {/*        <p>{pt.geometry.getCoordinates().join(' ')}</p>*/}
                            {/*    </div>*/}
                            {/*</RPopup>*/}
                        </RFeature>
                    })}
                </RLayerVector>
            </React.Fragment>
        )
    }
}