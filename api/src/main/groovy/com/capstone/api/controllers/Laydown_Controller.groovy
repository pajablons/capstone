package com.capstone.api.controllers

import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Weighted_Zone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.service.UserLaydownService
import com.capstone.api.util.PgPoint
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/laydown")
class Laydown_Controller {
    @Autowired
    private UserLaydownService laydownService

    @Autowired
    private DbUtilityService dbService

    @GetMapping("/update/weightzone/weight")
    void updateWeight(@RequestParam("id") int zone_id, @RequestParam("weight") int weight) {
        this.laydownService.updateWeight(zone_id, weight)
    }

    @GetMapping("/update/weightzone/name")
    void updateZoneName(@RequestParam("id") int zone_id, @RequestParam("name") String name) {
        this.laydownService.updateZoneName(zone_id, name)
    }

    @GetMapping("/retr/weightzones")
    List<Weighted_Zone> getWeightedZones(@RequestParam("pid") int profile_id) {
        List<Weighted_Zone> zones = laydownService.retrieveByProfileId(profile_id)
        for (Weighted_Zone z : zones) {
            z.generateGeojson(z.getGeom())
        }

        return zones
    }

    @GetMapping("/util/nearestPoint")
    Routing_Waypoint addNearestPoint(@RequestParam("lng") double lng, @RequestParam("lat") double lat) {
        PgPoint target = new PgPoint(lng, lat)
        println(target.toString())
        Routing_Waypoint rp = this.dbService.getNearestPoint(target)
        this.laydownService.insertWaypoint(rp.id as int, 1)
        return rp
    }

    @GetMapping("/points/remove")
    void removePoint(@RequestParam("prof_id") int profile_id, @RequestParam("point_id") int point_id) {
        this.laydownService.removeWaypoint(point_id, profile_id)
    }

    @GetMapping("/points/all")
    List<Routing_Waypoint> getWaypointsByProfile(@RequestParam("profile") int profile_id) {
        return this.laydownService.getWaypoints(profile_id)
    }

    @GetMapping("zones/buffer")
    void bufferZones(@RequestParam("meters") int meters, @RequestParam("collection") String collname) {
        this.laydownService.bufferZones(collname, meters)
        print("Buffered: " + collname + " " + meters)
    }

    @PostMapping("/add/weightzones")
    void addWeightedZones(@RequestBody List<Weighted_Zone> wzc) {
        println("Inserting " + wzc.size() + " zones")
        for (Weighted_Zone wz : wzc) {
            this.laydownService.insertWeightedZone(wz)
        }
    }

    @PostMapping("/delete/weightedzones")
    void deleteWeightedZones(@RequestBody List<Weighted_Zone> wzc) {
        println("Deleting: ")
        println(wzc)
        this.laydownService.deleteZones(wzc)
    }
}
