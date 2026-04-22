package com.naval.tracker.controller;

import com.naval.tracker.model.Navire;
import com.naval.tracker.service.NavireService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost", "http://localhost:4200"})
@RestController
@RequestMapping("/navires")
public class NavireController {

    private final NavireService navireService;

    public NavireController(NavireService navireService) {
        this.navireService = navireService;
    }

    @GetMapping
    public List<Navire> getAll() {
        return navireService.getAll();
    }

    @GetMapping("/{id}")
    public Navire getById(@PathVariable String id) {
        return navireService.getById(id);
    }

    @PostMapping
    public Navire ajouter(@RequestBody Navire navire) {
        return navireService.ajouter(navire);
    }

    @DeleteMapping("/{id}")
    public String supprimer(@PathVariable String id) {
        boolean supprime = navireService.supprimer(id);
        return supprime ? "Navire supprimé." : "Navire introuvable.";
    }

    @PatchMapping("/{id}/position")
    public Navire mettreAJourPosition(
            @PathVariable String id,
            @RequestParam double latitude,
            @RequestParam double longitude) throws Exception {
        return navireService.mettreAJourPosition(id, latitude, longitude);
    }
}