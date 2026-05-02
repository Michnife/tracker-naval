package com.naval.tracker.controller;

import com.naval.tracker.model.Groupe;
import com.naval.tracker.model.Navire;
import com.naval.tracker.service.GroupeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost", "http://localhost:4200"})
@RestController
@RequestMapping("/groupes")
public class GroupeController {

    private final GroupeService groupeService;

    public GroupeController(GroupeService groupeService) {
        this.groupeService = groupeService;
    }

    @GetMapping
    public List<Groupe> getAll() { return groupeService.getAll();}

    @GetMapping("/{id}")
    public Groupe getById(@PathVariable String id) { return  groupeService.getById(id);}

    @PostMapping
    public Groupe ajouter(@RequestBody Groupe groupe) { return groupeService.ajouter(groupe);}

    @DeleteMapping("/{id}")
    public String supprimer(@PathVariable String id) {
        boolean supr = groupeService.supprimer(id);
        return supr ? "Groupe supprimé" : "Groupe non trouvé";
    }

    @PostMapping("/{id}/navires/{navireId}")
    public Navire AjouterNavire(@PathVariable String id,@PathVariable String navireId) {
        return groupeService.ajouterNavire(id, navireId);
    }
}
