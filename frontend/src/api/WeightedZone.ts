import {Polygon} from "ol/geom";

export default class WeightedZone {
    id: number | undefined
    name: string | undefined
    geom: Polygon | undefined
    geojson: string | undefined
    weight: number | undefined
    profile_id: number | undefined
}