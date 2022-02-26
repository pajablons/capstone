import React from "react";
import {RFeature, RPopup} from "rlayers";
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import ControlMode from "../controls/ControlMode";
import Locale from "../../localize/Locale";

interface WeightedZoneFeatureProps {
    feature: Feature<Geometry>
    controlMode: ControlMode
    locale: Locale
    deletionFn: (feature: Feature<Geometry>) => void
}

interface WeightedZoneFeatureState {}

export default class WeightedZoneFeature extends React.Component<WeightedZoneFeatureProps, WeightedZoneFeatureState> {
    langData: any
    constructor(props: WeightedZoneFeatureProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    deleteSelf() {
        if (this.props.controlMode.mode === "edit-wz") {
            this.props.deletionFn(this.props.feature)
        }
    }

    render() {
        return (
            <RFeature
                feature={this.props.feature}
                onDblClick={this.deleteSelf.bind(this)}
            >
                {this.props.controlMode.mode === "edit-param" &&
                    <RPopup className={'card'} trigger={"click"}>
                        <div className={'container'}>
                            <p>{this.langData['featureData']['wz']['weight'][this.props.locale.lang]}: <input
                                type={"text"}
                                defaultValue={this.props.feature.get('weight')}
                                name={"weight_input"}
                                //onBlur={this.props.updateWeightFn}
                                zone-id={this.props.feature.get('id')}
                            /></p>
                        </div>
                    </RPopup>
                }
            </RFeature>
        )
    }
}