package com.capstone.api.service

import com.capstone.api.serial.GenCoverParams
import com.capstone.api.serial.InterdictionZone
import com.capstone.api.serial.Route
import com.capstone.api.serial.Routing_Wayzone

interface RoutingService {
    Route generateRoute(int profile_id, long src, long dst)
    List<InterdictionZone> generateCoverRegions(GenCoverParams params)
}