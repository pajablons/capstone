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

interface ZoneLayerProps {
    zIndex: number
    controlMode: ControlMode
    modFnRegistry: (saveFn: () => void, discardFn: () => void) => void
}

interface ZoneLayerState {
    zones: Array<Feature<Geometry>>
    addedFeatures: Array<Feature<Geometry>>
}

export default class ZoneLayer extends React.Component<ZoneLayerProps, ZoneLayerState> {
    langData: any
    deletedFeatures: Array<Feature<Geometry>>
    tmp_feature_id: number

    constructor(props: ZoneLayerProps) {
        super(props);
        this.state = {
            zones: new Array<Feature<Geometry>>(),
            addedFeatures: new Array<Feature<Geometry>>(),
        }

        this.tmp_feature_id = 0

        this.langData = require('../../localize/lang.json')
        this.deletedFeatures = new Array<Feature<Geometry>>()

        this.props.modFnRegistry(this.saveAllEdits.bind(this), this.discardAllEdits.bind(this))
    }

    componentDidMount() {
        this.createWzl()
    }

    createWzl(): void {
        axios.get("/api/laydown/retr/weightzones?pid=1").then(response => {
            let wzc = new Array<WeightedZone>();
            response.data.forEach((obj: any) => {
                wzc.push(Object.assign(new WeightedZone(), obj))
            })
            let data = new Array<Feature<Geometry>>()
            wzc.forEach((wz: WeightedZone) => {
                let geometry = JSON.parse(wz.geojson!)
                data.push(new Feature({
                    geometry: new Polygon(geometry['coordinates']).transform("EPSG:4326", "EPSG:3857"),
                    id: wz.id,
                    weight: wz.weight,
                    name: wz.name,
                }))
            })
            this.setState({
                zones: data,
                addedFeatures: new Array<Feature<Geometry>>()
            })
        })
    }

    featureToWZ(feat: Feature<Geometry>): WeightedZone {
        let geojson = new GeoJSON({featureProjection: "EPSG:3857"})
        let wz = new WeightedZone()
        if (feat.get('weight') != null) {
            wz.weight = feat.get('weight')
        } else {
            wz.weight = 5
        }
        if (feat.get("id") != null) {
            wz.id = feat.get('id')
        }
        wz.geojson = geojson.writeGeometry(feat.getGeometry()!)
        wz.profile_id = 1 // TODO
        if (feat.get('name') != null) {
            wz.name = feat.get('name')
        } else {
            wz.name = ""
        }
        return wz
    }

    saveNewWeightZones() {
        let wzc = new Array<WeightedZone>()

        this.state.addedFeatures.forEach((feature: Feature<Geometry>) => {
            feature.unset("tmp_id")
            wzc.push(this.featureToWZ(feature))
        })

        if (wzc.length === 0) {
            return
        }

        axios.post("/api/laydown/add/weightzones", wzc).then((response) => {
            if (response.status === 200) {
                this.createWzl()
            } else {
                console.log("Error in saving added weight zones:")
                console.log(response)
            }
        })
    }

    saveDeletedZones() {
        let toDelete = new Array<WeightedZone>()
        this.deletedFeatures.forEach((feature) => {
            toDelete.push(this.featureToWZ(feature))
        })
        if (toDelete.length > 0) {
            axios.post("/api/laydown/delete/weightedzones", toDelete).then((response) => {
                if (response.status === 200) {
                    this.deletedFeatures = new Array<Feature<Geometry>>()
                    this.createWzl()
                } else {
                    console.log("Error deleting zones:")
                    console.log(response)
                }
            })
        }
    }

    deleteZone(feature: Feature<Geometry>) {
        let id = feature.get('tmp_id')
        if (id != null) {
            const newAddedFeats = this.state.addedFeatures.filter((value) => {
                return value.get('tmp_id') != id
            })
            this.setState({
                addedFeatures: newAddedFeats
            })
        } else {
            id = feature.get('id')
            this.deletedFeatures.push(feature)
            const zones = this.state.zones.filter((value) => {
                return value.get('id') != id
            })
            this.setState({
                zones: zones
            })
        }
    }

    saveAllEdits() {
        this.saveNewWeightZones()
        this.saveDeletedZones()
    }

    discardAllEdits() {
        this.deletedFeatures = new Array<Feature<Geometry>>()
        this.createWzl()
    }

    addWeightZone(evt: BaseEvent) {
        let vecSource = evt.target as VectorSource<Geometry>
        const newData = new Array<Feature<Geometry>>()
        if (vecSource.forEachFeature) {
            vecSource.forEachFeature((feature) => {
                newData.push(feature)
            })

            if (newData.length > 0) {
                vecSource.clear()
                let newFeats = this.state.addedFeatures.concat(newData)
                newFeats.forEach((value) => {
                    value.set("tmp_id", this.tmp_feature_id++)
                })
                this.setState({
                    addedFeatures: newFeats
                })
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <RLayerVector zIndex={this.props.zIndex + 2} onChange={this.addWeightZone.bind(this)}>
                    {this.props.controlMode.mode === "edit-wz" &&
                        <RInteraction.RDraw
                            type={"Polygon"}
                            condition={never}
                            freehandCondition={noModifierKeys}
                        />
                    }
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex + 1}>
                    {this.state.addedFeatures.map((feature) => {
                        return <WeightedZoneFeature
                            deletionFn={this.deleteZone.bind(this)}
                            key={feature.get('tmp_id')}
                            feature={feature}
                            controlMode={this.props.controlMode}
                        />
                    })}
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex}>
                    {this.state.zones.map((feature) => {
                        return <WeightedZoneFeature
                            deletionFn={this.deleteZone.bind(this)}
                            key={feature.get('id')}
                            feature={feature}
                            controlMode={this.props.controlMode}
                        />
                    })}
                </RLayerVector>
            </React.Fragment>
        )
    }
}