import React from "react";
import AppContext from "../../AppContext";
import {Geometry} from "ol/geom";
import {Feature} from "ol";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import API_Engine from "../../api/API_Engine";
import {RequestState} from "../../ServerRequestState";

interface InterdictionZoneViewProps {

}

interface InterdictionZoneViewState {

}

export default class InterdictionZoneView extends React.Component<InterdictionZoneViewProps, InterdictionZoneViewState> {
    static contextType = AppContext
    langData = require('../../localize/lang.json')

    constructor(props: InterdictionZoneViewProps) {
        super(props)
    }

    selectIZ(evt: any) {
        this.context.selectIZ(parseInt(evt.currentTarget.getAttribute('ident')))
    }

    setSearchAreaMode() {
        this.context.setControlMode({
            mode: "edit-search-area"
        })
    }

    findInterdictionZones(evt: any) {
        this.context.setStatus(RequestState.LOADING)
        this.context.setControlMode("none")
        API_Engine.loadIZL(this.context.searchArea, this.context.edges).then((value: Array<Feature<Geometry>>) => {
            this.context.setInterdictionZones(value)
            if (value.length > 0) {
                this.context.setSelectedIZTier(0)
            }
            this.context.setStatus(RequestState.READY)
        })
    }

    exitEditMode() {
        this.context.setControlMode({
            mode: "none"
        })
    }

    render() {
        console.log(this.context.status)
        let tabHeaders = new Array<JSX.Element>()
        let tabPanels = new Array<JSX.Element>()
        let zoneData = new Map<number, Array<JSX.Element>>()
        this.context.izl.forEach((feature: Feature<Geometry>) => {
            let tier = feature.get('tier')
            if (!zoneData.has(tier)) {
                zoneData.set(tier, new Array<JSX.Element>())
            }
            zoneData.get(tier)!.push(
                <tr className={parseInt(feature.get('id')) === this.context.selectedIZ ? 'selected-data-table-row' : 'data-table-row'} key={feature.get('id')}
                    // @ts-ignore
                    ident={feature.get('id')}
                    onClick={this.selectIZ.bind(this)}>
                    <td>{feature.get('id')}</td>
                    <td>{Math.round(feature.get('baseCost') * 1000) / 1000}</td>
                    <td>{Math.round(feature.get('removalCost') * 1000) / 1000}</td>
                    <td>{Math.round(100 * (((feature.get('removalCost') + feature.get('baseCost')) / feature.get('baseCost')) - 1) * 1000) / 1000}</td>
                </tr>
            )
        })

        // @ts-ignore
        for (const key of zoneData.keys()) {
            tabHeaders.push(
                <Tab
                    key={key}
                >
                    Tier {key + 1}
                </Tab>
            )
            tabPanels.push(
                <TabPanel key={key}>
                    <div style={{overflow: "auto", height: "100%", maxHeight: "100%", width: "100%"}}>
                        <table className={"editTable"}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Base Cost (km)</th>
                                <th>Cost Increase (abs) (km)</th>
                                <th>Cost Increase (%)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {zoneData.get(key)}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            )
        }

        return (
            <div>
                {["edit-search-area"].includes(this.context.controlMode.mode) &&
                    <button
                        onClick={this.exitEditMode.bind(this)}
                    >
                        {this.langData['controls']['end-edit-wz'][this.context.locale.lang]}
                    </button>
                }

                {!["edit-search-area"].includes(this.context.controlMode.mode) &&
                    <button
                        disabled={this.context.status != RequestState.READY}
                        value={"edit-search-area"}
                        onClick={this.setSearchAreaMode.bind(this)}
                    >
                        {this.langData['controls']['set-search-area'][this.context.locale.lang]}
                    </button>
                }

                <button disabled={this.context.searchArea.length === 0 || this.context.edges.length === 0 || this.context.status != RequestState.READY}
                    onClick={this.findInterdictionZones.bind(this)}
                >
                    {this.context.status === RequestState.READY ? this.langData['controls']['interdict'][this.context.locale.lang] : this.langData['controls']['processing'][this.context.locale.lang]}
                </button>

                <Tabs defaultIndex={this.context.selectedTier}
                  onSelect={(index) => {
                      this.context.setSelectedIZTier(index)
                  }}
            >
                <TabList>
                    {tabHeaders}
                </TabList>
                {tabPanels}
            </Tabs>
            </div>
        )
    }
}