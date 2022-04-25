import React from "react";
import {RFeature, RLayerVector, RStyle} from "rlayers";
import {Feature} from "ol";
import {Geometry, LineString, MultiLineString} from "ol/geom";
import ControlFunction from "../../ControlFunction";
import axios from "axios";
import AppContext from "../../AppContext";

interface RouteLayerProps {
    zIndex: number
}

interface RouteLayerState {
}

export default class RouteLayer extends React.Component<RouteLayerProps, RouteLayerState> {
    static contextType = AppContext

    constructor(props: RouteLayerProps) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <RLayerVector zIndex={this.props.zIndex}>
                {this.context.routes.map((feature: Feature<Geometry>) => {
                    console.log("Rendered a feature")
                    return <RFeature
                        key={feature.get('id')}
                        feature={feature}
                    >
                    </RFeature>
                })}

                <RStyle.RStyle>
                    <RStyle.RStroke color="#0000ff" width={3} />
                    <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
                </RStyle.RStyle>
            </RLayerVector>
        )
    }
}