import React from "react";
import {RFeature, RLayerVector, RPopup} from "rlayers";
import {Feature} from "ol";
import {Geometry, Point} from "ol/geom";

interface WaypointLayerProps {
    waypoints: Array<Feature<Geometry>>
    zIndex: number
}

interface WaypointLayerState {

}

export default class WaypointLayer extends React.Component<WaypointLayerProps, WaypointLayerState> {
    render() {
        return (
            <RLayerVector zIndex={this.props.zIndex}>
                {this.props.waypoints.map((pt: Feature<Geometry>) => {
                    return <RFeature
                        key={pt.get('id')}
                        feature={pt}
                    >
                        <RPopup trigger={"click"} className={"card"}>
                            <div className={"container"}>
                                <p>{(pt.getGeometry() as Point).getCoordinates().join(' ')}</p>
                            </div>
                        </RPopup>
                    </RFeature>
                })}
            </RLayerVector>
        )
    }
}