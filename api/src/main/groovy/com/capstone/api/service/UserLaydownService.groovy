package com.capstone.api.service

import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.serial.Weighted_Zone

interface UserLaydownService {
    List<Weighted_Zone> retrieveByProfileId(int profile_id);
    void insertWeightedZone(Weighted_Zone wz);
    void insertWeightedZones(List<Weighted_Zone> wz);
    void deleteZone(Weighted_Zone wz)
    void deleteZones(List<Weighted_Zone> wzl)
    void insertRoutingWayzones(List<Routing_Wayzone> rw)
}
