import React from "react";
import {Button, IconButton} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";
import AppContext from "../../AppContext";
import API_Engine from "../../api/API_Engine";
import WeightedZoneStore from "../../datatypes/WeightedZoneStore";

interface BufferTriggerProps {
    collectionName: string
}

interface BufferTriggerState {
    bufferAmount: number
    bufferText: string
}

export default class BufferTrigger extends React.Component<BufferTriggerProps, BufferTriggerState> {
    static contextType = AppContext

    constructor(props: BufferTriggerProps) {
        super(props);
        this.state = {
            bufferAmount: 0,
            bufferText: ""
        }
    }

    execute() {
        if (/^-?\d+$/.test(this.state.bufferText)) {
        console.log("Executing")
            API_Engine.bufferZone(this.props.collectionName, Number.parseInt(this.state.bufferText)).then(() => {
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

    updateInput(evt: any) {
        this.setState({
            bufferText: evt.currentTarget.value
        })
    }

    render() {
        return (
            <React.Fragment>
                <label>Buffer Point Feature: </label>
                <input onChange={this.updateInput.bind(this)}/>
                <IconButton size={"small"} style={{width: "fit-content"}} onClick={this.execute.bind(this)}><ChevronRight /></IconButton>
            </React.Fragment>
        )
    }
}