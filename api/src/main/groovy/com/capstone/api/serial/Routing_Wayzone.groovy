package com.capstone.api.serial

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.locationtech.jts.geom.Polygon
import org.locationtech.jts.io.geojson.GeoJsonWriter
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.Transient

@Entity
@Table(name="wayzone")
class Routing_Wayzone implements Serializable {

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

    @Column(name = "profile_id")
    Integer profile_id
    void setProfileId(int profileid) {
        this.profile_id = profileid
    }

    @Column(name = "is_source")
    boolean is_source
    void set_is_source(boolean is_source) {
        this.is_source = is_source
    }

    @Column(name = "point_count")
    Integer point_count
}
