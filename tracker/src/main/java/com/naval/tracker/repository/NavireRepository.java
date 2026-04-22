package com.naval.tracker.repository;

import com.naval.tracker.model.Navire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NavireRepository extends JpaRepository<Navire, String> {
}