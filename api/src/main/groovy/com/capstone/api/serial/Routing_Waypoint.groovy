package com.capstone.api.serial

import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.geojson.GeoJsonWriter

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.Transient

@Entity
@Table(name="ways_vertices_pgr")
class Routing_Waypoint {
    @Id
    @GeneratedValue
    @Column(name="id")
    long id

    @Column(name = "geom_vertex")
    Geometry geom
    void setGeom(Geometry geom) {
        this.geom = geom
        this.generateGeojson(geom)
    }

    @Transient
    String geojson
    void setGeojson(String geojson) {
        this.geojson = geojson
    }

    void generateGeojson(Geometry geom) {
        this.setGeojson(new GeoJsonWriter().write(geom))
    }
}
