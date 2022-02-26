package com.capstone.api.service

import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.util.PgPoint
import org.locationtech.jts.geom.Point

interface DbUtilityService {
    Routing_Waypoint getNearestPoint(PgPoint pt);
    List<Routing_Waypoint> getWithin(Routing_Wayzone wz);
    }