package com.naval.tracker.repository;
import com.naval.tracker.model.Groupe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, String> {
}
