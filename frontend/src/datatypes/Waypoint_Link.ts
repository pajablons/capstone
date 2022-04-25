import Waypoint from "./Waypoint";

export default class Waypoint_Link {
    src: Waypoint
    dst: Waypoint
    isActive: boolean

    constructor(src: Waypoint, dst: Waypoint, isActive: boolean = true) {
        this.src = src
        this.dst = dst
        this.isActive = isActive
    }
}