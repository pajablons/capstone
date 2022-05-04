import React from "react";
import {RFeature, ROverlay, RPopup} from "rlayers";
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import ControlMode from "../controls/ControlMode";
import Locale from "../../localize/Locale";
import AppContext from "../../AppContext";
import {RStyle, RText} from "rlayers/style";

interface WeightedZoneFeatureProps {
    feature: Feature<Geometry>
    deletionFn: (feature: Feature<Geometry>) => void
}

interface WeightedZoneFeatureState {}

export default class WeightedZoneFeature extends React.Component<WeightedZoneFeatureProps, WeightedZoneFeatureState> {
    langData: any
    static contextType = AppContext
    constructor(props: WeightedZoneFeatureProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    deleteSelf() {
        if (this.context.controlMode.mode === "edit-wz") {
            this.props.deletionFn(this.props.feature)
        }
    }

    render() {
        return (
            <RFeature
                feature={this.props.feature}
                onDblClick={this.deleteSelf.bind(this)}
            >
                <ROverlay autoPosition={true}>
                    {this.props.feature.get('name')}
                </ROverlay>
            </RFeature>
        )
    }
}