import React from "react";
import {RFeature, RLayerVector, RStyle} from "rlayers";
import {Feature} from "ol";
import {Geometry} from "ol/geom";

interface RouteLayerProps {
    routes: Array<Feature<Geometry>>
    zIndex: number
}

interface RouteLayerState {

}

export default class RouteLayer extends React.Component<RouteLayerProps, RouteLayerState> {
    constructor(props: RouteLayerProps) {
        super(props);
    }

    render() {
        return (
            <RLayerVector zIndex={this.props.zIndex}>
                {this.props.routes.map((feature) => {
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