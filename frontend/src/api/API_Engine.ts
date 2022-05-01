import {Feature} from "ol";
import {Geometry, MultiLineString, Polygon} from "ol/geom";
import axios from "axios";
import Waypoint from "../datatypes/Waypoint";
import {GeoJSON} from "ol/format";
import GenCoverParams from "./GenCoverParams";
import WeightedZone from "./WeightedZone";
import WeightedZoneStore from "../datatypes/WeightedZoneStore";
import Waypoint_Link from "../datatypes/Waypoint_Link";

export default class API_Engine {
    static async generateRoute(edges: Array<Waypoint_Link>): Promise<Array<Feature<Geometry>>> {
        const newRoutes = new Array<Feature<Geometry>>()

        await Promise.all(edges.map(async (edge) => {
            let src = edge.src
            let dst = edge.dst

            let response = await axios.get(`/api/routing/getRoute?pid=${1}&src=${src.id}&dst=${dst.id}`)
            response.data['segments'].forEach((feature: any) => {
                newRoutes.push(new Feature<Geometry>({
                    id: feature['id'],
                    cost: feature['cost'],
                    geometry: new MultiLineString(feature.geom['coordinates']).transform("EPSG:4326", "EPSG:3857")
                }))
                console.log("Added a feature")
            })
        }))
        return newRoutes
    }


    static async loadIZL(searchArea: Array<Feature<Geometry>>, edges: Array<Waypoint_Link>): Promise<Array<Feature<Geometry>>> {
        if (searchArea.length == 0) {
            console.log("No search area defined")
            return new Array<Feature<Geometry>>()
        }
        let uid = 0
        const gridSquares = new Array<Feature<Geometry>>()
        for(let j = 0; j < edges.length; j++) {
            let waypoints = [edges[j].src, edges[j].dst]
            for (let i = 0; i < searchArea.length; i++) {
                let area = searchArea[i]
                let response = await axios.post("/api/routing/genCover", {
                    profile_id: 1,
                    src: waypoints[0].id,
                    dst: waypoints[1].id,
                    search_area_geojson: new GeoJSON({featureProjection: "EPSG:3857"}).writeGeometry(area.getGeometry()!)
                } as GenCoverParams)
                response.data.forEach((idZone: any) => {
                    gridSquares.push(new Feature({
                        route: idZone['associatedRoute']['segments'],
                        geometry: new Polygon(idZone['gridSquare']['coordinates']).transform('EPSG:4326', "EPSG:3857"),
                        tier: idZone['tier'],
                        baseCost: idZone['baseCost'],
                        removalCost: idZone['removalCost'],
                        id: uid++
                    }))
                })
                console.log(response.data.length)
            }
        }
        return gridSquares
    }

    static async createWzl(): Promise<Array<WeightedZoneStore>> {
        let response = await axios.get("/api/laydown/retr/weightzones?pid=1")
        let wzc = new Array<WeightedZone>();
        response.data.forEach((obj: any) => {
            wzc.push(Object.assign(new WeightedZone(), obj))
        })
        let data = new Array<WeightedZoneStore>()
        wzc.forEach((wz: WeightedZone) => {
            let geometry = JSON.parse(wz.geojson!)
            data.push(new WeightedZoneStore(
                wz.id as number,
                new Polygon(geometry['coordinates']).transform('EPSG:4326', 'EPSG:3857') as Polygon,
                wz.weight as number,
                wz.name as string
            ))
        })
        return data
    }
}