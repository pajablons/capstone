import React from "react";
import AppContext from "../../AppContext";
import {Geometry} from "ol/geom";
import {Feature} from "ol";

interface InterdictionZoneViewProps {

}

interface InterdictionZoneViewState {

}

export default class InterdictionZoneView extends React.Component<InterdictionZoneViewProps, InterdictionZoneViewState> {
    static contextType = AppContext

    constructor(props: InterdictionZoneViewProps) {
        super(props)
    }

    selectIZ(evt: any) {
        this.context.selectIZ(parseInt(evt.currentTarget.getAttribute('ident')))
    }

    render() {
        let rows = new Array<JSX.Element>()
        this.context.izl.forEach((feature: Feature<Geometry>) => {
            rows.push(
                <tr key={feature.get('id')}
                    // @ts-ignore
                    ident={feature.get('id')}
                    onClick={this.selectIZ.bind(this)}>
                    <td>{feature.get('id')}</td>
                    <td>{feature.get('removalCost')}</td>
                    <td>TODO</td>
                </tr>
            )
        })

        return (
            <div style={{overflow: "auto", position: "absolute", height: "100%", width: "100%"}}>
                <table className={"editTable"}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cost Increase (abs)</th>
                            <th>Cost Increase (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        )
    }
}