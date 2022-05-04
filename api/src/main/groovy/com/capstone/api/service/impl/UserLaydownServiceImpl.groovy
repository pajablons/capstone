package com.capstone.api.service.impl

import com.capstone.api.repository.Routing_Waypoint_Repo
import com.capstone.api.repository.Routing_Wayzone_Repo
import com.capstone.api.repository.Weighted_Zone_Repository
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.serial.Weighted_Zone
import com.capstone.api.service.UserLaydownService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserLaydownServiceImpl implements UserLaydownService {
    @Autowired
    private Weighted_Zone_Repository zoneRepository

    @Autowired
    private Routing_Waypoint_Repo wp_repo

    @Override
    List<Weighted_Zone> retrieveByProfileId(int profile_id) {
        return zoneRepository.retrieveZonesByProfile(profile_id)
    }

    @Override
    void insertWeightedZone(Weighted_Zone wz) {
        List<Weighted_Zone> wz_lst = new ArrayList<Weighted_Zone>()
        wz_lst.add(wz)
        this.insertWeightedZones(wz_lst)
    }

    @Override
    void insertWeightedZones(List<Weighted_Zone> wzl) {
        for (Weighted_Zone wz : wzl) {
            this.zoneRepository.insert(wz.geojson, wz.weight, wz.name, wz.profile_id, wz.collection, wz.gtype)
        }
    }

    @Override
    void bufferZones(String collection, int meters) {
        this.zoneRepository.bufferZones(meters, collection)
    }

    @Override
    void deleteZone(Weighted_Zone wz) {
        this.zoneRepository.deleteZone(wz.id)
    }

    @Override
    void deleteZones(List<Weighted_Zone> wzl) {
        for (Weighted_Zone wz : wzl) {
            this.deleteZone(wz)
        }
    }

    @Override
    void insertWaypoint(int point_id, int profile_id) {
        this.wp_repo.insertPoint(point_id, "", profile_id)
    }

    @Override
    List<Routing_Waypoint> getWaypoints(int profile_id) {
        return this.wp_repo.retrievePointsByProfile(profile_id)
    }

    @Override
    void removeWaypoint(int point_id, int profile_id) {
        this.wp_repo.deletePoint(point_id, profile_id)
    }

    @Override
    void updateWeight(int zone_id, int weight) {
        this.zoneRepository.updateWeight(zone_id, weight)
    }

    void updateZoneName(int zone_id, String name) {
        this.zoneRepository.updateZoneName(zone_id, name)
    }
}
