package com.capstone.api.service

import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.RouteSegment
import com.capstone.api.serial.Routing_Wayzone
import org.opengis.feature.simple.SimpleFeature

interface RoutingService {
    List<RouteSegment> generateRoute(int profile_id, int src, int dst)
    List<Routing_Wayzone> getWayzones(int profile_id, boolean source)
    List<SimpleFeature> generateCoverRegions(GenCoverParams params)
}