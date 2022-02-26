import {Point} from "ol/geom";

export default class PgWaypoint {
    id: number | undefined
    geom: Point | undefined
    geojson: string | undefined
}