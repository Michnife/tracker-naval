package com.naval.tracker.service;

import com.naval.tracker.model.Groupe;
import com.naval.tracker.model.Navire;
import com.naval.tracker.repository.GroupeRepository;
import com.naval.tracker.repository.NavireRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final NavireRepository navireRepository;

    public GroupeService(GroupeRepository groupeRepository, NavireRepository navireRepository) {
        this.groupeRepository = groupeRepository;
        this.navireRepository = navireRepository;
    }

    public List<Groupe> getAll() {
        return groupeRepository.findAll();
    }

    public Groupe getById(String id) {
        return groupeRepository.findById(id).orElse(null);
    }

    public Groupe ajouter(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    public boolean supprimer(String id) {
        if(groupeRepository.existsById(id)) {
            groupeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Navire ajouterNavire(String groupeId, String navireId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElse(null);
        Navire navire = navireRepository.findById(navireId).orElse(null);
        if(groupe == null || navire == null) return null;
        navire.setGroupe(groupe);
        return navireRepository.save(navire);
    }
}
