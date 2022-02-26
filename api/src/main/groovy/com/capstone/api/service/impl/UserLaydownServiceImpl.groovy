package com.capstone.api.service.impl

import com.capstone.api.repository.Routing_Wayzone_Repo
import com.capstone.api.repository.Weighted_Zone_Repository
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
    private Routing_Wayzone_Repo route_zone_repo

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
            this.zoneRepository.insert(wz.geojson, wz.weight, wz.name, wz.profile_id)
        }
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
    void insertRoutingWayzones(List<Routing_Wayzone> rwl) {
        for (Routing_Wayzone rw : rwl) {
            this.route_zone_repo.insertZone(rw.geojson, rw.point_count, rw.name, rw.profile_id, rw.is_source)
        }
    }
}
