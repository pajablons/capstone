package com.capstone.api.service.impl

import com.capstone.api.repository.RouteRepo
import com.capstone.api.repository.Routing_Wayzone_Repo
import com.capstone.api.repository.Weighted_Zone_Repository
import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.InterdictionZone
import com.capstone.api.serial.Route
import com.capstone.api.serial.RouteSegment
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.service.RoutingService
import org.codehaus.groovy.runtime.typehandling.GroovyCastException
import org.geotools.data.simple.SimpleFeatureIterator
import org.geotools.data.simple.SimpleFeatureSource
import org.geotools.geojson.geom.GeometryJSON
import org.geotools.geometry.jts.ReferencedEnvelope
import org.geotools.grid.Grids
import org.geotools.referencing.CRS
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.Polygon
import org.locationtech.jts.io.WKBReader
import org.locationtech.jts.io.geojson.GeoJsonWriter
import org.locationtech.jts.operation.linemerge.LineMerger
import org.opengis.feature.simple.SimpleFeature
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class RoutingServiceImpl implements RoutingService {
    @Autowired
    RouteRepo route_repository

    @Autowired
    DbUtilityService dbService

    @Autowired
    Routing_Wayzone_Repo wayzone_repo

    @Autowired
    Weighted_Zone_Repository weightedZoneRepository

    @Autowired
    JdbcTemplate jdbcTemplate

    @Override
    Route generateRoute(int profile_id, long src, long dst) {
        String sql = "with routing as (select edge, cost from pgr_dijkstra('select edge.id as id, edge.source as source, edge.target as target, coalesce(cost + weight, cost) as cost from ((select id as id, source as source, target as target, geom_way, km as cost from af_2po_4pgr) edge left join (select geom, weight from weighted_zones) zones on zones.geom && edge.geom_way) WHERE edge.geom_way && ST_Expand((SELECT ST_Collect(geom_vertex) FROM af_2po_vertex WHERE id IN (:src, :dst)), 2)', :src, :dst, directed=>false)) select id, km as cost, geom_way from af_2po_4pgr verts left join routing on routing.edge = verts.id where id in (select edge from routing)"
//        String sql = "select id, km as cost, geom_way from af_2po_4pgr where id in (select edge from pgr_dijkstra('select edge.id as id, edge.source as source, edge.target as target, coalesce(cost + weight, cost) as cost from ((select id as id, source as source, target as target, geom_way, km as cost from af_2po_4pgr) edge left join (select geom, weight from weighted_zones) zones on zones.geom && edge.geom_way) WHERE edge.geom_way && ST_Expand((SELECT ST_Collect(geom_vertex) FROM af_2po_vertex WHERE id IN (:src, :dst)), 2)', :src, :dst, directed=>false))"
        sql = sql.replaceAll(':src', "" + src)
        sql = sql.replaceAll(':dst', "" + dst)

        System.out.println("Going in")

        List<Map<String, Object>> obj = this.jdbcTemplate.queryForList(sql)
        System.out.println("Coming out")
        System.out.println(obj.size())
        Route container = new Route()
        List<RouteSegment> retn = new ArrayList<RouteSegment>()
        container.segments = retn
        WKBReader reader = new WKBReader()
        for (Map<String,Object> row : obj) {
            RouteSegment seg = new RouteSegment()
            seg.cost = (double)(row.get('cost'))
            container.totalCost += seg.cost
            String wkb = (String)(row.get('geom_way'))
            byte[] geom = WKBReader.hexToBytes(wkb)
            seg.geom = reader.read(geom)
            seg.id = (int)(row.get('id'))
            retn.add(seg)
        }
        return container
    }

    Route scoreCoverRegion2(
            int trials,
            int profile_id,
            long src,
            long dst,
            String geometry
    ) {
        for (int i = 0; i < trials; i++) {
            println("Got here")
            if (geometry != "") {
                this.weightedZoneRepository.insert(geometry, 900000000, "tmp_delete_me", profile_id)
            }

            Route option = this.generateRoute(profile_id, src, dst)

            println("Got out of here")
            if(geometry != "") {
                this.weightedZoneRepository.deleteZone("tmp_delete_me")
            }
            return option
        }
    }

    @Override
    List<InterdictionZone> generateCoverRegions(GenCoverParams params) {
        Route baseRoute = this.generateRoute(params.profile_id, params.src, params.dst)
        LineMerger lm = new LineMerger()
        for (RouteSegment rs : baseRoute.segments) {
            lm.add(rs.geom)
        }
        Collection merged = lm.getMergedLineStrings()

        double baseCost = baseRoute.totalCost
        println("Base cost: " + baseCost)

        GeometryJSON gjson = new GeometryJSON()
        Reader reader = new StringReader(params.search_area_geojson)

        GeoJsonWriter gjw = new GeoJsonWriter()
        Polygon search_area = gjson.readPolygon(reader)
        Map<Integer, List<InterdictionZone>> tierTree = new HashMap<Integer, List<InterdictionZone>>()
        int tiers = 5
        for (int i = 0; i < tiers; i++) {
            tierTree.put(i, new ArrayList<InterdictionZone>())
        }
        InterdictionZone root = new InterdictionZone()
        root.gridSquare = search_area
        root.tier = 0
        tierTree.get(0).add(root)
        for (int t = 0; t < tiers; t++) {
            println("Tier: " + t)
            List<InterdictionZone> coverRegions = new ArrayList<InterdictionZone>()
            for (int k = 0; k < Math.min(tierTree.get(t).size(), 10); k++) {
                InterdictionZone aoi = tierTree.get(t).get(k)
                println("Reached an AOI")
                Geometry envelope = aoi.gridSquare.getEnvelope()
                if (t == 0) {
                    envelope = envelope.buffer(0.2)
                }
                SimpleFeatureSource grid = Grids.createSquareGrid(new ReferencedEnvelope(envelope.getEnvelopeInternal(), CRS.decode("EPSG:3857")), /*(0.1 / Math.pow(2, t))-0.0001*/ aoi.gridSquare.getEnvelope().getEnvelopeInternal().width / 3)

                SimpleFeatureIterator itr = grid.getFeatures().features()
                println(grid.getFeatures().size())
                println(envelope)
                while (itr.hasNext()) {
                    println("Got into the iterator")
                    SimpleFeature sf = itr.next()
                    Geometry g = ((Geometry) (sf.getDefaultGeometry())).getEnvelope()
                    if (!g.intersects(aoi.gridSquare)) {
                        continue
                    }
                    println("Passed intersection")
                    g = g.intersection(aoi.gridSquare)
                    // This is super inefficient.  Would be better to convert the RouteSegments to a linestring and call
                    // g.intersects once per grid square.
                    println("Base route: " + baseRoute.totalCost)
                    for (Geometry segment : merged) {
                        if (g.intersects(segment)) {
                            InterdictionZone iz = new InterdictionZone()
                            g.setSRID(4326)
                            try {
                                iz.gridSquare = g as Polygon
                            } catch(GroovyCastException gce) {
                                continue
                            }
                            //double cost = this.scoreCoverRegion(1, 1, params.src, params.dst, gjw.write(g))
                            Route opt = this.scoreCoverRegion2(1,1,params.src,params.dst,gjw.write(g))
                            double cost = opt.totalCost
                            iz.removalCost = cost - baseCost
                            iz.tier = t
                            iz.baseCost = baseCost
                            iz.associatedRoute = opt
                            println("Base cost: " + baseCost)
                            println("Removal Cost: " + iz.removalCost)
                            coverRegions.add(iz)
                            break
                        }
                    }
                }
                coverRegions.sort(new Comparator<InterdictionZone>() {
                    @Override
                    int compare(InterdictionZone o1, InterdictionZone o2) {
                        double diff = o2.removalCost - o1.removalCost
                        if (diff > 0) {
                            return 1
                        } else if (diff < 0) {
                            return -1
                        } else {
                            return 0
                        }
                    }
                })
            }
            println(coverRegions.size())
            tierTree.put(t+1, coverRegions)
        }
        List<InterdictionZone> retn = new ArrayList<InterdictionZone>()
        for (int i = 1; i <= tiers; i++) {
            retn.addAll(tierTree.get(i))
        }
        return retn
    }
}
