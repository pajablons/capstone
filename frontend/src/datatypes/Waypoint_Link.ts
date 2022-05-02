import Waypoint from "./Waypoint";
import {Geometry} from "ol/geom";
import {Feature} from "ol";

export default class Waypoint_Link {
    src: Waypoint
    dst: Waypoint
    route_id: number | undefined
    route: Feature<Geometry> | undefined
    cost: number | undefined
    isActive: boolean

    constructor(src: Waypoint, dst: Waypoint, isActive: boolean = true) {
        this.src = src
        src.edges.push(this)
        this.dst = dst
        dst.edges.push(this)
        this.isActive = isActive
        this.route_id = undefined
    }

    setRouteId(id: number | undefined) {
        this.route_id = id
    }
}