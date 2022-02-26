package com.capstone.api.service.impl

import com.capstone.api.repository.Routing_Waypoint_Repo
import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.service.DbUtilityService
import com.capstone.api.util.PgPoint
import org.locationtech.jts.geom.Point
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DbUtilityServiceImpl implements DbUtilityService{
    @Autowired
    private Routing_Waypoint_Repo waypointRepo

    @Override
    Routing_Waypoint getNearestPoint(PgPoint pt) {
        return waypointRepo.getNearestPoint(pt.toString())
    }

    List<Routing_Waypoint> getWithin(Routing_Wayzone wz) {
        this.waypointRepo.getRandomPoints(wz.geojson, wz.point_count)
    }
}
