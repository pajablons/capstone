package com.capstone.api.repository

import com.capstone.api.serial.Routing_Wayzone
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

import javax.transaction.Transactional

@Repository
interface Routing_Wayzone_Repo extends JpaRepository<Routing_Wayzone, Integer> {
    @Query(value = "SELECT * FROM wayzone WHERE profile_id = :prof_id AND is_source = :is_source", nativeQuery = true)
    List<Routing_Wayzone> retrieveZonesByProfile(@Param("prof_id") int prof_id, @Param("is_source") boolean is_source)

    @Modifying
    @Query(value = "DELETE FROM wayzone WHERE id = :id", nativeQuery = true)
    @Transactional
    void deleteZone(@Param("id") int id)

    @Modifying
    @Query(value = "INSERT INTO wayzone (geom, name, profile_id, point_count, is_source) VALUES (ST_GeomFromGeoJSON(:geojson), :name, :profile_id, :point_count, :is_source", nativeQuery = true)
    @Transactional
    void insertZone(@Param("geojson") String geojson, @Param("point_count") int pount_count, @Param("name") String name, @Param("profile_id") int profile_id, @Param("is_source") boolean is_source)
}
