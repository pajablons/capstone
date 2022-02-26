package com.capstone.api.repository

import com.capstone.api.serial.Weighted_Zone
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

import javax.transaction.Transactional

@Repository
interface Weighted_Zone_Repository extends JpaRepository<Weighted_Zone, Integer> {
    @Query(value = "SELECT * FROM weighted_zones WHERE profile_id = :prof_id", nativeQuery = true)
    List<Weighted_Zone> retrieveZonesByProfile(@Param("prof_id") int prof_id)

    @Modifying
    @Query(value = "DELETE FROM weighted_zones WHERE id = :id", nativeQuery = true)
    @Transactional
    void deleteZone(@Param("id") int id)

    @Modifying
    @Query(value = "INSERT INTO weighted_zones (geom, name, profile_id, weight) VALUES (ST_GeomFromGeoJSON(:geojson), :name, :profile_id, :weight)", nativeQuery = true)
    @Transactional
    void insert(@Param("geojson") String geojson, @Param("weight") int weight, @Param("name") String name, @Param("profile_id") int profile_id)
}
