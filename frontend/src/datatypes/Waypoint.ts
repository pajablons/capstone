import {Geometry, Point} from "ol/geom";
import {Feature} from "ol";

export default class Waypoint {
    id: number
    geometry: Point
    feature: Feature<Geometry>

    constructor(coords: Array<number>, base_srid: string, id: number) {
        this.id = id
        this.geometry = new Point(coords).transform(`EPSG:${base_srid}`, 'EPSG:3857') as Point
        this.feature = new Feature({
            geometry: this.geometry,
            id: this.id
        })
    }
}