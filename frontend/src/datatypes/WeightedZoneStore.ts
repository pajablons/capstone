import {Geometry, Polygon} from "ol/geom";
import {Feature} from "ol";

export default class WeightedZoneStore {
    id: number
    weight: number
    is_tmp: boolean
    geometry: Polygon
    name: string
    feature: Feature<Polygon>

    constructor(id: number,
                geometry: Polygon,
                weight: number,
                name: string,
                is_tmp = false) {
        this.geometry = geometry
        this.id = id
        this.weight = weight
        this.is_tmp = is_tmp
        this.name = name
        this.feature = new Feature<Polygon>({
            geometry: this.geometry,
            name: this.name,
            id: this.id,
            weight: this.weight,
            is_tmp: this.is_tmp
        })
    }

    setIsTemp(is_tmp: boolean) {
        this.is_tmp = is_tmp
        this.feature.set("is_tmp", is_tmp)
    }
}