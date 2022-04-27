import React from "react";
import Locale from "../../localize/Locale";
import ControlMode from "./ControlMode";
import {ControlDisplayTier} from "./ControlPanel";
import ControlFunction from "../../ControlFunction";
import AppContext from "../../AppContext";
import WeightedZone from "../../api/WeightedZone";
import {Feature} from "ol";
import {Geometry} from "ol/geom";
import axios from "axios";
import API_Engine from "../../api/API_Engine";
import Util from "../../Util";
import WeightedZoneStore from "../../datatypes/WeightedZoneStore";

interface EditControlTableProps {
    controlPanelModeFn: (tier: ControlDisplayTier) => void
}

interface EditControlTableState {}

export default class EditControlTable extends React.Component<EditControlTableProps, EditControlTableState> {
    langData: any
    static contextType = AppContext
    constructor(props: EditControlTableProps) {
        super(props);
        this.langData = require('../../localize/lang.json')
    }

    saveDeletedZones() {
        let toDelete = new Array<WeightedZone>()
        this.context.deletedZones.forEach((feature: Feature<Geometry>) => {
            toDelete.push(Util.featureToWZ(feature))
        })
        if (toDelete.length > 0) {
            axios.post("/api/laydown/delete/weightedzones", toDelete).then((response) => {
                if (response.status === 200) {
                    this.context.setDeletedZones(new Array<Feature<Geometry>>())
                    API_Engine.createWzl().then((zones) => {
                        this.context.setAddedZones(new Array<Feature<Geometry>>())
                        let zMap = new Map<number, WeightedZoneStore>()
                        zones.forEach((z: WeightedZoneStore) => {
                            zMap.set(z.id, z)
                        })
                        this.context.setZones(zMap)
                    })
                } else {
                    console.log("Error deleting zones:")
                    console.log(response)
                }
            })
        }
    }

    saveNewWeightZones() {
        let wzc = new Array<WeightedZone>()

        this.context.addedZones.forEach((feature: WeightedZoneStore) => {
            feature.setIsTemp(false)
            wzc.push(Util.featureToWZ(feature.feature))
        })
        this.context.setAddedZones(new Array<Feature<Geometry>>())

        if (wzc.length === 0) {
            return
        }

        axios.post("/api/laydown/add/weightzones", wzc).then((response) => {
            if (response.status === 200) {
                API_Engine.createWzl().then((zones) => {
                    let zMap = new Map<number, WeightedZoneStore>()
                    zones.forEach((z: WeightedZoneStore) => {
                        zMap.set(z.id, z)
                    })
                    this.context.setZones(zMap)
                })
            } else {
                console.log("Error in saving added weight zones:")
                console.log(response)
            }
        })
    }

    saveAllChanges() {
        this.saveNewWeightZones()
        this.saveDeletedZones()
    }

    endEditMode(evt: any) {
        this.props.controlPanelModeFn("root")
        this.saveAllChanges()
        this.setEditMode(evt)
    }

    setEditMode(evt: any) {
        console.log(evt.target.value)
        this.context.setControlMode({
            mode: evt.target.value
        })
    }

    clearWaypoints(evt: any) {
        this.context.clearWaypoints()
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td><button value={"edit-wz"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-wz'][this.context.locale.lang]}</button></td>
                        <td><button value={"edit-wp"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['edit-wp'][this.context.locale.lang]}</button></td>
                        <td><button value={"clear-wp"} onClick={this.clearWaypoints.bind(this)}>{this.langData['controls']['clear-wp'][this.context.locale.lang]}</button></td>
                    </tr>
                    <tr>
                        <td><button value={"edit-search-area"} onClick={this.setEditMode.bind(this)}>{this.langData['controls']['set-search-area'][this.context.locale.lang]}</button></td>
                        <td><button value={"none"} onClick={this.endEditMode.bind(this)}>{this.langData['controls']['end-edit-session'][this.context.locale.lang]}</button></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}