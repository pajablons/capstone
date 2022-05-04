package com.capstone.api.service

import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Weighted_Zone

interface UserLaydownService {
    List<Weighted_Zone> retrieveByProfileId(int profile_id);
    void insertWeightedZone(Weighted_Zone wz);
    void insertWeightedZones(List<Weighted_Zone> wz);
    void deleteZone(Weighted_Zone wz)
    void deleteZones(List<Weighted_Zone> wzl)
    void insertWaypoint(int point_id, int profile_id)
    List<Routing_Waypoint> getWaypoints(int profile_id)
    void removeWaypoint(int point_id, int profile_id)
    void updateWeight(int zone_id, int weight)
    void updateZoneName(int zone_id, String name)
    void bufferZones(String collection, int meters)
}
