import {Geometry, Point} from "ol/geom";
import {Feature} from "ol";
import Waypoint_Link from "./Waypoint_Link";

export default class Waypoint {
    id: number
    geometry: Point
    feature: Feature<Geometry>
    edges: Array<Waypoint_Link>

    constructor(coords: Array<number>, base_srid: string, id: number) {
        this.id = id
        this.geometry = new Point(coords).transform(`EPSG:${base_srid}`, 'EPSG:3857') as Point
        this.feature = new Feature({
            geometry: this.geometry,
            id: this.id
        })
        this.edges = new Array<Waypoint_Link>()
    }
}