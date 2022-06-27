package com.capstone.api.repository

import com.capstone.api.serial.Routing_Waypoint
import com.capstone.api.serial.SavedPointData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

import javax.transaction.Transactional;

@Repository
interface Routing_Waypoint_Repo extends JpaRepository<Routing_Waypoint, Integer> {
    @Query(value = "SELECT *, waypoints.geom_vertex <-> ST_GeomFromText(:target,4326) AS dist FROM af_2po_vertex waypoints ORDER BY dist LIMIT 1", nativeQuery = true)
    Routing_Waypoint getNearestPoint(@Param("target") String target)

    @Query(value = "SELECT * from af_2po_vertex WHERE id in (select point_id FROM waypoints WHERE profile_id = :prof_id)", nativeQuery = true)
    List<Routing_Waypoint> retrievePointsByProfile(@Param("prof_id") int prof_id)

    @Modifying
    @Query(value = "DELETE FROM waypoints", nativeQuery = true)
    @Transactional
    void deleteAll()

    @Modifying
    @Query(value = "DELETE FROM waypoints WHERE point_id = :id and profile_id = :prof_id", nativeQuery = true)
    @Transactional
    void deletePoint(@Param("id") int id, @Param("prof_id") int prof_id)

    @Modifying
    @Query(value = "INSERT INTO waypoints (point_id, name, profile_id) VALUES (:point_id, :name, :profile_id)", nativeQuery = true)
    @Transactional
    void insertPoint(@Param("point_id") int pid, @Param("name") String name, @Param("profile_id") int profile_id)
}
