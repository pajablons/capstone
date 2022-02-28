package com.capstone.api.serial

import org.locationtech.jts.geom.Geometry

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name="ways")
class RouteSegment {
    @Id
    @GeneratedValue
    @Column(name="gid")
    int id

    @Column(name="cost")
    double cost

    @Column(name="the_geom")
    Geometry geom
}
