package com.naval.tracker.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naval.tracker.handler.NavireWebSocketHandler;
import com.naval.tracker.model.Navire;
import com.naval.tracker.repository.NavireRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NavireService {

    private final NavireRepository navireRepository;
    private final NavireWebSocketHandler navireWebSocketHandler;

    public NavireService(NavireRepository navireRepository, NavireWebSocketHandler navireWebSocketHandler) {
        this.navireRepository = navireRepository;
        this.navireWebSocketHandler = navireWebSocketHandler;
    }

    public List<Navire> getAll() {
        return navireRepository.findAll();
    }

    public Navire getById(String id) {
        return navireRepository.findById(id).orElse(null);
    }

    public Navire ajouter(Navire navire) {
        return navireRepository.save(navire);
    }

    public boolean supprimer(String id) {
        if(navireRepository.existsById(id)) {
            navireRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Navire mettreAJourPosition(String id, double latitude, double longitude) throws Exception {
        Navire n = getById(id);
        if(n == null) return null;
        n.setLatitude(latitude);
        n.setLongitude(longitude);
        Navire sauvegarde = navireRepository.save(n);
        String json = new ObjectMapper().writeValueAsString(sauvegarde);
        navireWebSocketHandler.broadcast(json);
        return sauvegarde;
    }
}