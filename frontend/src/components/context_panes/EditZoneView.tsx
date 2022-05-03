import React from "react";
import AppContext from "../../AppContext";
import WeightedZone from "../../api/WeightedZone";
import WeightedZoneStore from "../../datatypes/WeightedZoneStore";
import {RequestState} from "../../ServerRequestState";
import {GeoJSON} from "ol/format";
import Util from "../../Util";
import API_Engine from "../../api/API_Engine";
import {Feature} from "ol";
import {Geometry, Point, Polygon} from "ol/geom";
import {buffer} from "ol/extent";

interface EditZoneViewProps {

}

interface EditZoneViewState {

}

export default class EditZoneView extends React.Component<EditZoneViewProps, EditZoneViewState> {
    static contextType = AppContext
    langData = require('../../localize/lang.json')

    constructor(props: EditZoneViewProps) {
        super(props)
    }

    setEditMode() {
        this.context.setControlMode({
            mode: "edit-wz"
        })
    }

    exitEditMode() {
        this.context.setControlMode({
            mode: "none"
        })
    }

    uploadFile(evt: any) {
        let reader = new FileReader()
        reader.readAsText(evt.currentTarget.files[0])

        reader.onload = (evt) => {
            let gjson = new GeoJSON().readFeatures(reader.result)
            let newData = new Array<WeightedZone>()
            gjson.forEach((data) => {
                let geojson = new GeoJSON({featureProjection: "EPSG:4326"})
                let wz = new WeightedZone()
                let bufferedExtent = buffer(data.getGeometry().getExtent(), 0.001)
                let bufferPolygon = new Polygon(
                    [
                        [[bufferedExtent[0],bufferedExtent[1]],
                            [bufferedExtent[0],bufferedExtent[3]],
                            [bufferedExtent[2],bufferedExtent[3]],
                            [bufferedExtent[2],bufferedExtent[1]],
                            [bufferedExtent[0],bufferedExtent[1]]]
                    ]
                );
                wz.geojson = geojson.writeGeometry(bufferPolygon)
                console.log(wz.geojson)
                wz.weight = 5
                wz.name = ""
                wz.profile_id = 1
                newData.push(wz)
            })
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
    }


    render() {
        let zoneRows = new Array<JSX.Element>()
        Array.from(this.context.zones.values()).forEach((zone: any) => {
            zoneRows.push(
                <tr key={zone.id} className={'data-table-row'}>
                    <td>{zone.id}</td>
                    <td><input defaultValue={zone.weight} /></td>
                    <td><input defaultValue={zone.name} /></td>
                </tr>
            )
        })

        return (
            <div style={{overflow: "auto", height: "100%", maxHeight: "100%", width: "100%"}}>
                {this.context.controlMode.mode != "edit-wz" &&
                    <button
                        disabled={this.context.status != RequestState.READY}
                        onClick={this.setEditMode.bind(this)}
                    >
                        {this.langData['controls']['edit-wz'][this.context.locale.lang]}
                    </button>
                }

                {this.context.controlMode.mode === "edit-wz" &&
                    <button
                        onClick={this.exitEditMode.bind(this)}
                    >
                        {this.langData['controls']['end-edit-wz'][this.context.locale.lang]}
                    </button>
                }

                <input type={"file"} onChange={this.uploadFile.bind(this)} />

                <table className={"editTable"}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zoneRows}
                    </tbody>
                </table>
            </div>
        )
    }
}