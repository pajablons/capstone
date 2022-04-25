import React from "react";
import {RFeature, RLayerVector, RPopup} from "rlayers";
import {Feature} from "ol";
import {Geometry, Point} from "ol/geom";
import AppContext from "../../AppContext";
import Waypoint from "../../datatypes/Waypoint";

interface WaypointLayerProps {
    zIndex: number
}

interface WaypointLayerState {

}

export default class WaypointLayer extends React.Component<WaypointLayerProps, WaypointLayerState> {
    static contextType = AppContext

    render() {
        return (
            <RLayerVector zIndex={this.props.zIndex}>
                {this.context.waypoints.map((pt: Waypoint) => {
                    return <RFeature
                        key={pt.id}
                        feature={pt.feature}
                    >
                        <RPopup trigger={"click"} className={"card"}>
                            <div className={"container"}>
                                <p>{pt.geometry.getCoordinates().join(' ')}</p>
                            </div>
                        </RPopup>
                    </RFeature>
                })}
            </RLayerVector>
        )
    }
}