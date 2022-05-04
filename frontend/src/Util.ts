import {Feature} from "ol";
import {Geometry} from "ol/geom";
import WeightedZone from "./api/WeightedZone";
import {GeoJSON} from "ol/format";

export default class Util {
    static featureToWZ(feat: Feature<Geometry>): WeightedZone {
        let geojson = new GeoJSON({featureProjection: "EPSG:3857"})
        let wz = new WeightedZone()
        if (feat.get('weight') != null) {
            wz.weight = feat.get('weight')
        } else {
            wz.weight = 5
        }
        if (feat.get("id") != null) {
            wz.id = feat.get('id')
        }
        wz.geojson = geojson.writeGeometry(feat.getGeometry()!)
        wz.profile_id = 1 // TODO
        if (feat.get('name') != null) {
            wz.name = feat.get('name')
        } else {
            wz.name = ""
        }
        wz.collection = feat.get('collection')
        wz.gtype = feat.get('gtype')
        return wz
    }
}