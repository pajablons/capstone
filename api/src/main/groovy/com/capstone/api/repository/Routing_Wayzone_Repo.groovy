package com.capstone.api.repository

import com.capstone.api.serial.Routing_Wayzone
import com.capstone.api.serial.SavedPointData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

import javax.transaction.Transactional

@Repository
interface Routing_Wayzone_Repo extends JpaRepository<Routing_Wayzone, Integer> {
    @Query(value = "SELECT * FROM points WHERE profile_id = :prof_id", nativeQuery = true)
    List<SavedPointData> retrievePointsByProfile(@Param("prof_id") int prof_id)

    @Modifying
    @Query(value = "DELETE FROM waypoints WHERE id = :id", nativeQuery = true)
    @Transactional
    void deletePoint(@Param("id") int id)

    @Modifying
    @Query(value = "INSERT INTO waypoints (point_id, name, profile_id) VALUES (:point_id, :name, :profile_id", nativeQuery = true)
    @Transactional
    void insertPoint(@Param("point_id") int pid, @Param("name") String name, @Param("profile_id") int profile_id)
}
