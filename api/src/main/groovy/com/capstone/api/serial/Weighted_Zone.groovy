package com.capstone.api.serial

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.locationtech.jts.io.geojson.GeoJsonReader
import org.locationtech.jts.io.geojson.GeoJsonWriter
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import org.locationtech.jts.geom.Polygon

import javax.persistence.Transient

@Entity
@Table(name="weighted_zones")
class Weighted_Zone implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name="id")
    Integer id

    @Column(name = "name")
    String name
    void setName(String name) {
        this.name = name
    }

    @Column(name = "geom")
    @JsonSerialize(using = GeometrySerializer.class)
    @JsonDeserialize(contentUsing = GeometryDeserializer.class)
    Polygon geom
    void setGeom(Polygon geom) {
        this.geom = geom
        this.generateGeojson(geom)
    }

    @Transient
    String geojson
    void setGeojson(String geojson) {
        this.geojson = geojson
    }

    void generateGeojson(Polygon geom) {
        this.setGeojson(new GeoJsonWriter().write(geom))
    }

    @Column(name = "weight")
    Integer weight
    void setWeight(int weight) {
        this.weight = weight
    }

    @Column(name = "profile_id")
    Integer profile_id
    void setProfileId(int profileid) {
        this.profile_id = profileid
    }

    @Override
    String toString() {
        return this.geojson.toString() + "\n"
    }
}
