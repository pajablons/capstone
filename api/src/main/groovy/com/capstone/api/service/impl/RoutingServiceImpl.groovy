package com.capstone.api.service.impl

import com.capstone.api.repository.RouteRepo
import com.capstone.api.repository.Routing_Wayzone_Repo
import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.RouteSegment
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.service.RoutingService
import org.geotools.data.simple.SimpleFeatureIterator
import org.geotools.data.simple.SimpleFeatureSource
import org.geotools.geojson.geom.GeometryJSON
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.Polygon
import org.opengis.feature.simple.SimpleFeature
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RoutingServiceImpl implements RoutingService {
    @Autowired
    RouteRepo route_repository

    @Autowired
    DbUtilityService dbService

    @Autowired
    Routing_Wayzone_Repo wayzone_repo

    @Override
    List<RouteSegment> generateRoute(int profile_id, int src, int dst) {
        return this.route_repository.getRoutes(src, dst)
    }

    @Override
    List<Routing_Wayzone> getWayzones(int profile_id, boolean source) {
        return this.wayzone_repo.retrieveZonesByProfile(profile_id, source)
    }

    double scoreCoverRegion(
            String cover_table,
            int trials,
            int profile_id,
            List<Routing_Wayzone> sources,
            List<Routing_Wayzone> targets
    ) {
        double totalScore = 0
        for (int trialNum = 0; i < trials; i++) {

        }
    }

    @Override
    List<SimpleFeature> generateCoverRegions(GenCoverParams params) {
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

        GeometryJSON gjson = new GeometryJSON()
        Reader reader = new StringReader(params.search_area_geojson)
        Polygon search_area = gjson.readPolygon(reader)
        SimpleFeatureSource grid = Grids.createSquareGrid(search_area.getEnvelope(), 5.0)
        SimpleFeatureIterator itr = (SimpleFeatureIterator) grid.features()
        while (itr.hasNext()) {
            SimpleFeature sf = itr.next()
            Geometry g = ((Geometry)(sf.getDefaultGeometry())).getEnvelope()

        }
    }
}
