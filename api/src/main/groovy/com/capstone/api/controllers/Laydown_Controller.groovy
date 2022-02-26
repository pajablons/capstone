package com.capstone.api.controllers

import com.capstone.api.serial.Weighted_Zone
import com.capstone.api.service.UserLaydownService
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

    @GetMapping("/retr/weightzones")
    List<Weighted_Zone> getWeightedZones(@RequestParam("pid") int profile_id) {
        List<Weighted_Zone> zones = laydownService.retrieveByProfileId(profile_id)
        for (Weighted_Zone z : zones) {
            z.generateGeojson(z.getGeom())
        }

        return zones
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
