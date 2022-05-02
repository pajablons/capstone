import React from "react";
import {RFeature, RInteraction, RLayerVector, RPopup, RStyle} from "rlayers";
import {altShiftKeysOnly, shiftKeyOnly, noModifierKeys, never} from "ol/events/condition";
import {Feature} from "ol";
import {Geometry, Polygon} from "ol/geom";
import ControlMode from "../controls/ControlMode";
import Locale from "../../localize/Locale";
import WeightedZone from "../../api/WeightedZone";
import {GeoJSON} from "ol/format";
import axios from "axios";
import WeightedZoneFeature from "./WeightedZoneFeature";
import VectorSource from "ol/source/Vector";
import BaseEvent from "ol/events/Event";
import API_Engine from "../../api/API_Engine";
import Util from "../../Util";
import AppContext from "../../AppContext";
import WeightedZoneStore from "../../datatypes/WeightedZoneStore";

interface ZoneLayerProps {
    zIndex: number
}

interface ZoneLayerState {
}

export default class ZoneLayer extends React.Component<ZoneLayerProps, ZoneLayerState> {
    static contextType = AppContext

    langData: any
    tmp_feature_id: number

    constructor(props: ZoneLayerProps) {
        super(props);
        this.state = {
        }

        this.tmp_feature_id = 0

        this.langData = require('../../localize/lang.json')
    }

    componentDidMount() {
        API_Engine.createWzl().then((zones) => {
            let zMap = new Map<number, WeightedZoneStore>()
            zones.forEach((z: WeightedZoneStore) => {
                zMap.set(z.id, z)
            })
            this.context.setZones(zMap)
        })
    }

    deleteZone(feature: Feature<Geometry>) {
        console.log("Deleting: " + feature)
        API_Engine.deleteWZ([Util.featureToWZ(feature)]).then(() => {
            API_Engine.createWzl().then((zones) => {
                let zMap = new Map<number, WeightedZoneStore>()
                zones.forEach((z: WeightedZoneStore) => {
                    zMap.set(z.id, z)
                })
                this.context.setZones(zMap)
            })
        })
    }

    addWeightZone(evt: BaseEvent) {
        let vecSource = evt.target as VectorSource<Geometry>
        const newData = new Array<WeightedZone>()
        if (vecSource.forEachFeature) {
            vecSource.forEachFeature((feature) => {
                newData.push(Util.featureToWZ(feature))
            })

            if (newData.length > 0) {
                vecSource.clear()
            }
        }
        if (newData.length == 0) {
            return
        }
        API_Engine.insertWZ(newData).then(() => {
            API_Engine.createWzl().then((zones) => {
                let zMap = new Map<number, WeightedZoneStore>()
                zones.forEach((z: WeightedZoneStore) => {
                    zMap.set(z.id, z)
                })
                this.context.setZones(zMap)
            })
        })
    }

    render() {
        return (
            <React.Fragment>
                <RLayerVector zIndex={this.props.zIndex + 2} onChange={this.addWeightZone.bind(this)}>
                    {this.context.controlMode.mode === "edit-wz" &&
                        <RInteraction.RDraw
                            type={"Polygon"}
                            condition={never}
                            freehandCondition={noModifierKeys}
                        />
                    }
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex}>
                    {Array.from(this.context.zones.values()).map((store: any) => {
                        let feature = store.feature
                        return <WeightedZoneFeature
                            deletionFn={this.deleteZone.bind(this)}
                            key={store.id}
                            feature={feature}
                        />
                    })}
                </RLayerVector>
            </React.Fragment>
        )
    }
}