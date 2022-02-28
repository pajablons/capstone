package com.capstone.api.repository

import com.capstone.api.serial.RouteSegment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface RouteRepo extends JpaRepository<RouteSegment, Integer> {
    @Query(value = "select gid, cost, the_geom from ways where gid in (select edge from pgr_dijkstra('select pt.gid as id, pt.source as source, pt.target as target, (cost_s * -1) as reverse_cost, coalesce(cost_s + weight, cost_s) as cost from ways pt left join (select geom, weight from weighted_zones) py on ST_Intersects(py.geom, pt.the_geom)', :src, :dst, directed=>false))", nativeQuery = true)
    List<RouteSegment> getRoutes(@Param("src") int src, @Param("dst") int dst)

    @Query(value = "select SUM(cost) from ways where gid in (select edge from pgr_dijkstra('select pt.gid as id, pt.source as source, pt.target as target, (cost_s * -1) as reverse_cost, coalesce(cost_s + weight, cost_s) as cost from ways pt left join (select geom, weight from weighted_zones) py on ST_Intersects(py.geom, pt.the_geom)', :src, :dst, directed=>false))", nativeQuery = true)
    double getRouteCost(@Param("src") int src, @Param("dst") int dst/*, @Param("geojson") String geojson*/)
}
