package com.capstone.api.serial

import org.locationtech.jts.geom.Polygon

class InterdictionZone {
    Polygon gridSquare
    Route associatedRoute
    double removalCost
    double baseCost
    int tier
}
