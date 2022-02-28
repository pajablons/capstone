package com.capstone.api.service.impl

import com.capstone.api.repository.RouteRepo
import com.capstone.api.repository.Routing_Wayzone_Repo
import com.capstone.api.repository.Weighted_Zone_Repository
import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.InterdictionZone
import com.capstone.api.serial.RouteSegment
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.service.RoutingService
import org.geotools.data.simple.SimpleFeatureIterator
import org.geotools.data.simple.SimpleFeatureSource
import org.geotools.geojson.geom.GeometryJSON
import org.geotools.geometry.jts.ReferencedEnvelope
import org.geotools.grid.Grids
import org.geotools.referencing.CRS
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.Polygon
import org.locationtech.jts.io.geojson.GeoJsonWriter
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
    List<RouteSegment> generateRoute(int profile_id, int src, int dst) {
        return this.route_repository.getRoutes(src, dst)
    }

    @Override
    List<Routing_Wayzone> getWayzones(int profile_id, boolean source) {
        return this.wayzone_repo.retrieveZonesByProfile(profile_id, source)
    }

    double scoreCoverRegion(
            int trials,
            int profile_id,
            int src,
            int dst,
            String geometry
    ) {
        double totalScore = 0
        for (int i = 0; i < trials; i++) {
            this.weightedZoneRepository.insert(geometry, 100000, "tmp_delete_me", profile_id)
            double result = this.route_repository.getRouteCost(src, dst)
            this.weightedZoneRepository.deleteZone("tmp_delete_me")
            totalScore += result
        }
        return totalScore
    }

    @Override
    List<InterdictionZone> generateCoverRegions(GenCoverParams params) {
        List<Routing_Wayzone> sources = this.getWayzones(params.profile_id, true)
        List<Routing_Wayzone> targets = this.getWayzones(params.profile_id, false)

        List<Routing_Waypoint> sourcePoints = new ArrayList<Routing_Waypoint>()
        List<Routing_Waypoint> targetPoints = new ArrayList<Routing_Waypoint>()
        for (Routing_Wayzone wz : sources) {
            sourcePoints.addAll(this.dbService.getWithin(wz))
        }
        for (Routing_Wayzone wz : targets) {
            targetPoints.addAll(this.dbService.getWithin(wz))
        }

        List<RouteSegment> baseRoute = this.generateRoute(params.profile_id, params.src, params.dst)
        double baseCost = 0
        for (RouteSegment rs : baseRoute) {
            baseCost += rs.cost
        }

        GeometryJSON gjson = new GeometryJSON()
        Reader reader = new StringReader(params.search_area_geojson)

        GeoJsonWriter gjw = new GeoJsonWriter()
        Polygon search_area = gjson.readPolygon(reader)
        Map<Integer, List<InterdictionZone>> tierTree = new HashMap<Integer, List<InterdictionZone>>()
        int tiers = 3
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
            for (InterdictionZone aoi : tierTree.get(t)) {
                println("Reached an AOI")
                Geometry envelope = aoi.gridSquare.getEnvelope()
                SimpleFeatureSource grid = Grids.createSquareGrid(new ReferencedEnvelope(envelope.getEnvelopeInternal(), CRS.decode("EPSG:3857")), (0.1 / Math.pow(2, t))-0.0001)

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
                    println("Base route: " + baseRoute.size())
                    for (RouteSegment segment : baseRoute) {
                        if (g.intersects(segment.geom)) {
                            InterdictionZone iz = new InterdictionZone()
                            g.setSRID(4326)
                            iz.gridSquare = g as Polygon
                            double cost = this.scoreCoverRegion(1, 1, params.src, params.dst, gjw.write(g))
                            iz.removalCost = ((cost - baseCost) / baseCost) * 100
                            iz.tier = 1
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
            tierTree.put(t+1, coverRegions.subList(0, Math.min(coverRegions.size(), 10) as int))
        }
        return tierTree.get(tiers)
    }
}
