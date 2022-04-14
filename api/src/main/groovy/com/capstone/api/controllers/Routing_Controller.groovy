package com.capstone.api.controllers

import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.InterdictionZone
import com.capstone.api.serial.RouteSegment
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.service.RoutingService
import com.capstone.api.util.PgPoint
import org.geotools.data.simple.SimpleFeatureIterator
import org.geotools.data.simple.SimpleFeatureSource
import org.geotools.geojson.geom.GeometryJSON
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.LineSegment
import org.locationtech.jts.geom.Polygon
import org.opengis.feature.simple.SimpleFeature
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/routing")
class Routing_Controller {
    @Autowired
    private DbUtilityService dbService

    @Autowired
    private RoutingService routerService

    @GetMapping("/util/nearestPoint")
    Routing_Waypoint getNearestPoint(@RequestParam("lng") double lng, @RequestParam("lat") double lat) {
        PgPoint target = new PgPoint(lng, lat)
        println(target.toString())
        return this.dbService.getNearestPoint(target)
    }

    @GetMapping("/getRoute")
    List<RouteSegment> getRoute(
            @RequestParam("pid") int profile_id,
            @RequestParam("src") long src,
            @RequestParam("dst") long dst
    ) {
        println(src)
        return this.routerService.generateRoute(profile_id, src, dst)
    }

    @PostMapping("/genCover")
    List<InterdictionZone> genCover(
            @RequestBody GenCoverParams params
    ) {
        return this.routerService.generateCoverRegions(params)
    }
}
