package com.capstone.api.repository

import com.capstone.api.serial.Weighted_Zone
import com.sun.org.apache.xpath.internal.operations.Mod
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
    @Query(value = "update weighted_zones set geom = ST_Buffer(geom\\:\\:geography, :meters)\\:\\:geometry where collection like :collname", nativeQuery = true)
    @Transactional
    void bufferZones(@Param("meters") int meters, @Param("collname") String collname)

    @Modifying
    @Query(value = "DELETE FROM weighted_zones", nativeQuery = true)
    @Transactional
    void deleteAll()

    @Modifying
    @Query(value = "DELETE FROM weighted_zones WHERE id = :id", nativeQuery = true)
    @Transactional
    void deleteZone(@Param("id") int id)

    @Modifying
    @Query(value = "UPDATE weighted_zones SET weight = :weight WHERE id = :id", nativeQuery = true)
    @Transactional
    void updateWeight(@Param("id") int id, @Param("weight") int weight)

    @Modifying
    @Query(value = "UPDATE weighted_zones SET name = :name WHERE id = :id", nativeQuery = true)
    @Transactional
    void updateZoneName(@Param("id") int id, @Param("name") String weight)

    @Modifying
    @Query(value = "DELETE FROM weighted_zones WHERE name = :name", nativeQuery = true)
    @Transactional
    void deleteZone(@Param("name") String name)

    @Modifying
    @Query(value = "INSERT INTO weighted_zones (geom, name, profile_id, weight, collection, gtype) VALUES (ST_GeomFromGeoJSON(:geojson), :name, :profile_id, :weight, :collection, :gtype)", nativeQuery = true)
    @Transactional
    int insert(@Param("geojson") String geojson, @Param("weight") int weight, @Param("name") String name, @Param("profile_id") int profile_id, @Param("collection") String collection, @Param("gtype") String gtype)
}
