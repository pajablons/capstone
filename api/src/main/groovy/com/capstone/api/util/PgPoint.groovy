package com.capstone.api.util

import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.geojson.GeoJsonReader

class PgPoint {
    double lat
    double lng
    String epsg = "4326"

    PgPoint(double lng, double lat) {
        this.lat = lat
        this.lng = lng
    }

    static PgPoint fromGeoJson(String geojson) {
        Point pt = new GeoJsonReader().read(geojson)
        return new PgPoint(pt.getX(), pt.getY())
    }

    String toString() {
        return "POINT(" + this.lng + " " + this.lat + ")"
    }
}
