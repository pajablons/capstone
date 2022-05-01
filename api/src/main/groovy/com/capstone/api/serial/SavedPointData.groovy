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
@Table(name="waypoints")
class SavedPointData {
    @Id
    @GeneratedValue
    @Column(name="id")
    long id

    @Column(name="point_id")
    long point_id
    void setPointId(long id) {
        this.point_id = id
    }

    @Column(name="name")
    String name
    void setName(String name) {
        this.name = name
    }
}
