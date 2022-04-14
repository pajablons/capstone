import React from "react";
import {RFeature, RLayerVector, RStyle} from "rlayers";
import {Feature} from "ol";
import {Geometry, LineString, MultiLineString} from "ol/geom";
import ControlFunction from "../../ControlFunction";
import axios from "axios";

interface RouteLayerProps {
    zIndex: number
    executorRegistryFn: (ident: ControlFunction, fn: () => void) => void
    waypoints: Array<Feature<Geometry>>
}

interface RouteLayerState {
    routes: Array<Feature<Geometry>>
}

export default class RouteLayer extends React.Component<RouteLayerProps, RouteLayerState> {
    constructor(props: RouteLayerProps) {
        super(props);

        this.state = {
            routes: new Array<Feature<Geometry>>()
        }

        this.props.executorRegistryFn({
            identity: "gen-rts"
        }, this.generateRoute.bind(this))
    }

    generateRoute() {
        if (this.props.waypoints.length < 2) {
            return
        }

        //this.state.waypoints.sort()
        let src = this.props.waypoints[0]
        let dst = this.props.waypoints[1]
        const newRoutes = new Array<Feature<Geometry>>()
        axios.get(`/api/routing/getRoute?pid=${1}&src=${src.get('id')}&dst=${dst.get('id')}`).then((response) => {
            response.data.forEach((feature: any) => {
                newRoutes.push(new Feature<Geometry>({id: feature['id'], cost: feature['cost'], geometry: new MultiLineString(feature.geom['coordinates']).transform("EPSG:4326", "EPSG:3857")}))
                let g = new MultiLineString(feature.geom['coordinates'])
                let l = g.transform("EPSG:4326", "EPSG:3857")
                console.log("Added a feature")
            })
            this.setState({routes: [...newRoutes]})
        })
    }

    render() {
        return (
            <RLayerVector zIndex={this.props.zIndex}>
                {this.state.routes.map((feature) => {
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