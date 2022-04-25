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
        let id = feature.get('id')
        console.log("in here with id")
        console.log(id)
        if (feature.get('is_tmp')) {
            const newAddedFeats = this.context.addedZones.filter((value: WeightedZoneStore) => {
                console.log(`${value.id} | ${id}`)
                return value.id != id
            })
            this.context.setAddedZones(newAddedFeats)
        } else {
            this.context.deletedZones.push(feature)
            const zones = this.context.zones
            zones.delete(id)
            this.context.setZones(zones)
            console.log("Deleted")
        }
    }

    addWeightZone(evt: BaseEvent) {
        let vecSource = evt.target as VectorSource<Geometry>
        const newData = new Array<WeightedZoneStore>()
        if (vecSource.forEachFeature) {
            vecSource.forEachFeature((feature) => {
                let id = -1
                if (!!feature.get('id'))
                    id = feature.get('id')
                else id = this.tmp_feature_id++
                newData.push(new WeightedZoneStore(id, feature.getGeometry() as Polygon, feature.get('weight'), feature.get('name'), true))
            })

            if (newData.length > 0) {
                vecSource.clear()
                let newFeats = this.context.addedZones.concat(newData)
                this.context.setAddedZones(newFeats)
            }
        }
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

                <RLayerVector zIndex={this.props.zIndex + 1}>
                    {this.context.addedZones.map((feature: WeightedZoneStore) => {
                        console.log(feature.id)
                        return <WeightedZoneFeature
                            deletionFn={this.deleteZone.bind(this)}
                            key={feature.id}
                            feature={feature.feature}
                        />
                    })}
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