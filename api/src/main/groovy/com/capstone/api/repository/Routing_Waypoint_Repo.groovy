package com.capstone.api.repository

import com.capstone.api.serial.Routing_Waypoint
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository;

@Repository
interface Routing_Waypoint_Repo extends JpaRepository<Routing_Waypoint, Integer> {
    @Query(value = "SELECT *, waypoints.the_geom <-> ST_GeomFromText(:target,4326) AS dist FROM ways_vertices_pgr waypoints ORDER BY dist LIMIT 1", nativeQuery = true)
    Routing_Waypoint getNearestPoint(@Param("target") String target)

    @Query(value = "select gid from ST_Intersects(ways_vertices_pgr.the_geom, ST_GeomFromGeoJSON(:geojson)) TABLESAMPLE system_rows(:sample_count)", nativeQuery = true)
    List<Integer> getRandomPoints(@Param("geojson") String geojson, @Param("sample_count") int sample_count)
}
