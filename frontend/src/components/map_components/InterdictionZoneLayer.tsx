import React from "react";
import ControlMode from "../controls/ControlMode";
import Locale from "../../localize/Locale";
import {Feature} from "ol";
import {Geometry, MultiLineString, Polygon} from "ol/geom";
import axios from "axios";
import ControlFunction from "../../ControlFunction";
import {RFeature, RInteraction, RLayerVector, RPopup, RStyle} from "rlayers";
import GenCoverParams from "../../api/GenCoverParams";
import {never, noModifierKeys} from "ol/events/condition";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import AppContext from "../../AppContext";

interface InterdictionZoneLayerProps {
    zIndex: number
}

interface InterdictionZoneLayerState {
    altRoute: number | null
}

export default class InterdictionZoneLayer extends React.Component<InterdictionZoneLayerProps, InterdictionZoneLayerState> {
    static contextType = AppContext

    constructor(props: InterdictionZoneLayerProps) {
        super(props);

        this.state = {
            altRoute: null
        }
    }

    changeSearchArea(evt: any) {
        let vecSource = evt.target as VectorSource<Geometry>
        let newSearchArea = null
        if (vecSource.forEachFeature) {
            vecSource.forEachFeature((feature) => {
                newSearchArea = feature
            })
            if (newSearchArea != null) {
                vecSource.clear()
                this.context.setSearchArea(newSearchArea)
            }
        }
    }

    viewAltRoute(evt: any) {
        this.setState({altRoute: evt.target.value})
    }

    render() {
        return (
            <React.Fragment>
                {!!this.context.selectedIZ &&
                    <RLayerVector zIndex={this.props.zIndex}>
                        {this.context.izl[this.context.selectedIZ].get('route').map((feature: any) => {
                            let seg = new Feature<Geometry>({id: feature['id'], cost: feature['cost'], geometry: new MultiLineString(feature.geom['coordinates']).transform("EPSG:4326", "EPSG:3857")})
                            return <RFeature
                                key={seg.get('id')}
                                feature={seg}
                            />
                        })}

                        <RStyle.RStyle>
                            <RStyle.RStroke color="#ff0000" width={3}/>
                            <RStyle.RFill color="rgba(0, 0, 0, 0.75)"/>
                        </RStyle.RStyle>
                    </RLayerVector>
                }

                <RLayerVector zIndex={this.props.zIndex + 2} onAddFeature={this.changeSearchArea.bind(this)}>
                    {this.context.controlMode.mode === "edit-search-area" &&
                        <RInteraction.RDraw
                            type={"Polygon"}
                            condition={never}
                            freehandCondition={noModifierKeys}
                        />
                    }
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex + 1}>
                    {this.context.searchArea.length > 0 &&
                        this.context.searchArea.map((area: Feature<Geometry>) => {
                            return (
                                <RFeature feature={area}/>
                            )
                        })
                    }
                </RLayerVector>

                <RLayerVector zIndex={this.props.zIndex}>
                    {this.context.izl.map((feature: Feature<Geometry>) => {
                        return (
                            <RFeature feature={feature} key={feature.get('id')}>
                                <RPopup className={'card'} trigger={'click'}>
                                    <div className={"container"}>
                                        <p>{feature.get('removalCost')}</p>
                                        <button value={feature.get('id')} onClick={this.viewAltRoute.bind(this)}>View Route</button>
                                    </div>
                                </RPopup>
                            </RFeature>
                        )
                    })}

                    <RStyle.RStyle render={(feature) => {
                        console.log(this.context.selectedIZ === feature.get('id'))
                        return (
                            <RStyle.RFill
                                color={feature.get('id') === this.context.selectedIZ ? `rgba(0, 0, 0, 0.8)` : `rgba(200, 200, 0, 0.25)`}
                            />
                        )
                    }} />
                </RLayerVector>
            </React.Fragment>
        )
    }
}